import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'

export default class AuditHistoryService {
  constructor(private readonly prisonerFinanceSyncApiClient: PrisonerFinanceSyncApiClient) {}

  async getPayloadByRequestId(requestId: string): Promise<NomisSyncPayloadDetail> {
    const detail = await this.prisonerFinanceSyncApiClient.getPayloadByRequestId(requestId)

    if (detail.body && typeof detail.body === 'string') {
      try {
        detail.body = JSON.parse(detail.body)
      } catch {
        // Ignore parsing errors and return body as string
      }
    }

    return detail
  }
}
