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

  router.post('/audit', async (req, res) => {
    const { dateFrom, dateTo, query } = req.body

    const params = new URLSearchParams({
      dateFrom,
      dateTo,
      query,
    })

    return res.redirect(`/audit?${params.toString()}`)
  })

  router.get('/audit', async (req, res) => {
    await auditService.logPageView(Page.AUDIT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    let { dateFrom, dateTo, query } = req.query
    let payloadSummaryData

    if (!dateFrom || !dateTo) {
      const today = new Date()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(today.getDate() - 30)

      dateFrom = formatDatePickerDate(thirtyDaysAgo)
      dateTo = formatDatePickerDate(today)
    } else {
      const dateFromStr = String(dateFrom)
      const dateToStr = String(dateTo)
      const queryStr = query ? String(query) : ''

      payloadSummaryData = (
        await auditHistoryService.getPayloadSummary(dateFromStr, dateToStr, queryStr)
      ).content
    }

    return res.render('pages/audit/history', {
      dateFrom,
      dateTo,
      query,
      payloadSummaryData,
    })
  })

  return router
}
