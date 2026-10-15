import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import AuditHistoryService from './auditHistoryService'
import PrisonerFinanceService from './prisonerFinanceService'
import GeneralLedgerService from './generalLedgerService'
import logger from '../../logger'
import config from '../config'
import HoldsService from './holdsService'

export const services = () => {
  const {
    applicationInfo,
    prisonerFinanceSyncApiClient,
    prisonerFinanceApiClient,
    generalLedgerApiClient,
    holdsApiClient,
  } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    prisonerFinanceService: new PrisonerFinanceService(prisonerFinanceApiClient),
    generalLedgerService: new GeneralLedgerService(generalLedgerApiClient),
    prisonerHoldsService: new HoldsService(holdsApiClient),
  }
}

export type Services = ReturnType<typeof services>
