import { Router } from 'express'
import type { Services } from '../services'
import { Page } from '../services/auditService'

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

  return router
}
