import { dataAccess } from '../data'
import AuditService from './auditService'
import AuditHistoryService from './auditHistoryService'
import PrisonerFinanceService from './prisonerFinanceService'
import GeneralLedgerService from './generalLedgerService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    prisonerFinanceSyncApiClient,
    prisonerFinanceApiClient,
    generalLedgerApiClient,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    PrisonerFinanceService: new PrisonerFinanceService(prisonerFinanceApiClient),
    GeneralLedgerService: new GeneralLedgerService(generalLedgerApiClient),
  }
}

export type Services = ReturnType<typeof services>
