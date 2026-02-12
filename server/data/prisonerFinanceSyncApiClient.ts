import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { CursorPage } from '../interfaces/cursorPage'
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

  async getPayloadSummary(params: AuditHistorySearchParams): Promise<CursorPage<NomisSyncPayloadSummary>> {
    const query = {
      ...params,
      legacyTransactionId: params.legacyTransactionId?.toString(),
      size: (params.size || 20).toString(),
    }

    return this.get({ path: `/audit/history`, query }, asSystem())
  }
}
