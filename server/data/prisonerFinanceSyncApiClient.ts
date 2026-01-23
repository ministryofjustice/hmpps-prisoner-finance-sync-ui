import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { Page } from '../interfaces/page'

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
    ) as Promise<NomisSyncPayloadDetail>
  }

  async getPayloadSummary(prisonId?: string, legacyTransactionId?: number, startDate?: string, endDate?: string) {
    return this.get(
      {
        path: `/audit/history`,
        query: {
          prisonId: prisonId || undefined,
          legacyTransactionId: legacyTransactionId,
          startDate: startDate,
          endDate: endDate,
        },
      },
      asSystem(),
    ) as Promise<Page<NomisSyncPayloadSummary>>
  }
}
