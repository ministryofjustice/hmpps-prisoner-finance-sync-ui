import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { Page } from '../interfaces/page'
import { AuditHistorySearchParams } from '../interfaces/auditHistorySearchParams'

export default class PrisonerFinanceSyncApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prisoner Finance Sync API', config.apis.prisonerFinanceSyncApi, logger, authenticationClient)
  }

  async getPayloadByRequestId(requestId: string): Promise<NomisSyncPayloadDetail> {
    return this.get(
      {
        path: `/audit/history/${requestId}`,
      },
      asSystem(),
    )
  }

  async getPayloadSummary({
    prisonId,
    legacyTransactionId,
    startDate,
    endDate,
    page = 0,
    size = 20,
  }: AuditHistorySearchParams = {}): Promise<Page<NomisSyncPayloadSummary>> {
    return this.get(
      {
        path: `/audit/history`,
        query: {
          ...(prisonId && { prisonId }),
          ...(legacyTransactionId && { legacyTransactionId: legacyTransactionId.toString() }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          page: page.toString(),
          size: size.toString(),
        },
      },
      asSystem(),
    )
  }
}
