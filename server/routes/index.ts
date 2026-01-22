import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import { formatDatePickerDate } from '../utils/datePickerUtils'

export default function routes({ auditService, auditHistoryService , prisonSyncService}: Services): Router {
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

  router.post('/audit-history/', async (req, res, next) => {
    await auditService.logPageView(Page.AUDITHISTORY, { who: res.locals.user.username, correlationId: req.id })
    // initial page route

    const { query } = req.body

    const { dateFrom } = req.body

    const { dateTo } = req.body

    const tableData = await prisonSyncService.getTransactionData(dateFrom, dateTo, query)

    res.render('pages/audithistory', {
      tableData,
      query,
      dateFrom,
      dateTo,
    })
  })

  router.get('/audit-history/', async (req, res, next) => {
    await auditService.logPageView(Page.AUDITHISTORY, { who: res.locals.user.username, correlationId: req.id })
    // landing route when the page is first visited

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const dateFrom = formatDatePickerDate(today)
    const dateTo = formatDatePickerDate(thirtyDaysAgo)

    // got the initial results

    return res.render('pages/audithistory', {
      dateFrom,
      dateTo,
    })
  })

  return router
}
