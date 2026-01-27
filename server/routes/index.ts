import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import paginationFromPageResponse from '../utils/pagination'

export default function routes({ auditService, auditHistoryService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.INDEX_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    return res.render('pages/index')
  })

  router.get('/audit/:requestId', async (req, res, next) => {
    const { requestId } = req.params
    const { user } = res.locals

    await auditService.logPageView(Page.AUDIT_DETAIL_PAGE, {
      who: user.username,
      correlationId: req.id,
    })

    const auditDetail = await auditHistoryService.getPayloadByRequestId(requestId)

    return res.render('pages/audit/detail', {
      auditDetail,
    })
  })

  router.get('/audit', async (req, res, next) => {
    await auditService.logPageView(Page.AUDIT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { endDate, startDate, prisonId, legacyTransactionId, page } = req.query

    const searchStartDate = (startDate as string) || null
    const searchEndDate = (endDate as string) || null
    const prisonIdStr = prisonId ? String(prisonId) : ''
    const legacyTransactionIdNumber = legacyTransactionId ? parseInt(legacyTransactionId as string, 10) : null

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const safePageNumber = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber

    const payloadSummaryPage = await auditHistoryService.getPayloadSummary({
      prisonId: prisonIdStr,
      legacyTransactionId: legacyTransactionIdNumber,
      startDate: searchStartDate,
      endDate: searchEndDate,
      page: safePageNumber - 1,
      size: 20,
    })

    const pagination = paginationFromPageResponse(
      payloadSummaryPage,
      new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
    )

    return res.render('pages/audit/history', {
      startDate: searchStartDate,
      endDate: searchEndDate,
      legacyTransactionId: legacyTransactionIdNumber ?? '',
      payloadSummaryData: payloadSummaryPage.content,
      pagination,
    })
  })

  return router
}
