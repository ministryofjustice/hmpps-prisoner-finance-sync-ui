import { dataAccess } from '../data'
import AuditHistoryService from './auditHistoryService'
import PrisonerFinanceService from './prisonerFinanceService'
import GeneralLedgerService from './generalLedgerService'
import HoldsService from './holdsService'
import AuditService from './auditService'

export const services = () => {
  const {
    applicationInfo,
    prisonerFinanceSyncApiClient,
    prisonerFinanceApiClient,
    generalLedgerApiClient,
    holdsApiClient,
    hmppsAuditClient,
  } = dataAccess()

  return {
    applicationInfo,
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    prisonerFinanceService: new PrisonerFinanceService(prisonerFinanceApiClient),
    generalLedgerService: new GeneralLedgerService(generalLedgerApiClient),
    prisonerHoldsService: new HoldsService(holdsApiClient),
    auditService: new AuditService(hmppsAuditClient),
  }
}

export type Services = ReturnType<typeof services>
