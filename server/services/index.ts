import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditHistoryService from './auditHistoryService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, prisonerFinanceSyncApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
  }
}

export type Services = ReturnType<typeof services>
