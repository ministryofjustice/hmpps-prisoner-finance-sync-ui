import { Router } from 'express'
import type { Services } from '../services'
import AuditController from '../controllers/auditController'
import HomeController from '../controllers/homeController'

export default function routes(services: Services): Router {
  const router = Router()

  const homeController = new HomeController(services)
  const auditController = new AuditController(services)

  router.get('/', homeController.index)
  router.get('/audit', auditController.history)
  router.get('/audit/:requestId', auditController.detail)

  return router
}
