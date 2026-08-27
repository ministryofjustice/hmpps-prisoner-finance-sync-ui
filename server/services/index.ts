import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import AuditHistoryService from './auditHistoryService'
import PrisonerFinanceService from './prisonerFinanceService'
import GeneralLedgerService from './generalLedgerService'
import logger from '../../logger'
import config from '../config'

export const services = () => {
  const { applicationInfo, prisonerFinanceSyncApiClient, prisonerFinanceApiClient, generalLedgerApiClient } =
    dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    auditHistoryService: new AuditHistoryService(prisonerFinanceSyncApiClient),
    prisonerFinanceService: new PrisonerFinanceService(prisonerFinanceApiClient),
    generalLedgerService: new GeneralLedgerService(generalLedgerApiClient),
  }
}

export type Services = ReturnType<typeof services>
