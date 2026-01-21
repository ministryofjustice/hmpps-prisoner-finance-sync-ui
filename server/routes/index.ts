import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function routes({ auditService, prisonSyncService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    return res.render('pages/index')
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
    // place holder route for audit history transaction details

    const currentTime = ''
    return res.render('pages/audithistory', { currentTime })
  })

  return router
}
