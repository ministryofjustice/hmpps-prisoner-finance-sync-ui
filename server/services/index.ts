import { dataAccess, PrisonerFinanceApiClient } from '../data'
import AuditService from './auditService'
import AuditHistoryService from './auditHistoryService'
import PrisonerFinanceService from './prisonerFinanceService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    prisonerFinanceSyncApiClient,
    prisonerFinanceApiClient }
    = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    PrisonerFinanceService: new PrisonerFinanceService(prisonerFinanceApiClient)
  }
}

export type Services = ReturnType<typeof services>
