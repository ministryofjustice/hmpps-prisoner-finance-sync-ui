import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditHistoryService from './auditHistoryService'
import PrisonSyncService from './prisonSyncService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, prisonerFinanceSyncApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    prisonSyncService: new PrisonSyncService(),
  }
}

export type Services = ReturnType<typeof services>
