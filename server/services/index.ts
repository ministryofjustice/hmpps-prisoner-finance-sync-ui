import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditHistoryService from './auditHistoryService'
import PrisonerTransactionService from './prisonerTransactionService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, prisonerFinanceSyncApiClient } = dataAccess()

  const prisonerTransactionService = new PrisonerTransactionService()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    prisonerTransactionService,
  }
}

export type Services = ReturnType<typeof services>
