import { Router } from 'express'
import type { Services } from '../services'
import AuditController from '../controllers/auditController'
import HomeController from '../controllers/homeController'
import prisonerController from '../controllers/prisonerController'
import PrisonerController from '../controllers/prisonerController'

export default function routes(services: Services): Router {
  const router = Router()

  const homeController = new HomeController(services)
  const auditController = new AuditController(services)
  const prisonerController = new PrisonerController(services)

  router.get('/', homeController.index)
  router.get('/audit', auditController.history)
  router.get('/audit/:payloadId', auditController.detail)
  router.get('/:prisonNumber/money', prisonerController.getTransactions)

  return router
}
