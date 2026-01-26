import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import { formatDatePickerDate } from '../utils/datePickerUtils'

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
    try {
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
    } catch (error) {
      return next(error)
    }
  })

  router.get('/audit', async (req, res) => {
    await auditService.logPageView(Page.AUDIT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { startDate, endDate, prisonId, legacyTransactionId } = req.query

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const searchStartDate = (startDate as string) || formatDatePickerDate(thirtyDaysAgo)
    const searchEndDate = (endDate as string) || formatDatePickerDate(today)
    const prisonIdStr = prisonId ? String(prisonId) : ''
    const legacyTransactionIdNumber = legacyTransactionId ? parseInt(legacyTransactionId as string, 10) : null

    const payloadSummaryData = (
      await auditHistoryService.getPayloadSummary(
        prisonIdStr,
        legacyTransactionIdNumber,
        searchStartDate,
        searchEndDate,
      )
    ).content

    return res.render('pages/audit/history', {
      startDate: searchStartDate,
      endDate: searchEndDate,
      legacyTransactionId: legacyTransactionIdNumber,
      payloadSummaryData,
    })
  })

  return router
}
