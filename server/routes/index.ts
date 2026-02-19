import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import paginationFromCursor from '../utils/pagination/cursor'

export default function routes({ auditService, auditHistoryService, prisonerTransactionService }: Services): Router {
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

    const { page, cursor, prev, ...filters } = req.query as Record<string, string>

    const pageNumber = parseInt(page, 10) || 1
    const prevCursors = cursor ? prev || '' : ''

    const apiFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))

    const cursorPage = await auditHistoryService.getMatchingPayloads({
      ...apiFilters,
      cursor: cursor || null,
      size: 20,
    })

    const currentUrl = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`)
    const pagination = paginationFromCursor(cursorPage, currentUrl, prevCursors, pageNumber)

    return res.render('pages/audit/history', {
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      legacyTransactionId: filters.legacyTransactionId || '',
      prisonId: filters.prisonId || '',
      payloadSummaryData: cursorPage.content,
      pagination,
    })
  })

  router.get('/prisoner/:prisonerNumber/transactions', async (req, res, next) => {
    const { prisonerNumber } = req.params
    const { accountType } = req.query

    const selectedAccountTypes = [accountType].flat().filter(Boolean) as string[]

    const transactions = await prisonerTransactionService.getTransactions(prisonerNumber, selectedAccountTypes)

    return res.render('pages/transactions/index', {
      prisonerNumber,
      transactions,
      filters: {
        accountType: selectedAccountTypes.reduce((acc, type) => ({ ...acc, [type]: true }), {}),
      },
    })
  })

  return router
}
