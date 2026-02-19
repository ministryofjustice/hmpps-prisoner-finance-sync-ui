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

  router.get('/prisoner/:prisonerNumber/transactions', async (req, res, next) => {
    const { prisonerNumber } = req.params
    const { accountType } = req.query

    const selectedAccountTypes = [accountType].flat().filter(Boolean) as string[]

    const transactions = await services.prisonerTransactionService.getTransactions(prisonerNumber, selectedAccountTypes)

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
