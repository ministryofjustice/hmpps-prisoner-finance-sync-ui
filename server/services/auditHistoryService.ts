import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import logger from '../../logger'

export default class AuditHistoryService {
  constructor(private readonly prisonerFinanceSyncApiClient: PrisonerFinanceSyncApiClient) {}

  async getPayloadByRequestId(requestId: string): Promise<NomisSyncPayloadDetail> {
    const detail = await this.prisonerFinanceSyncApiClient.getPayloadByRequestId(requestId)

    if (detail.body && typeof detail.body === 'string') {
      try {
        detail.body = JSON.parse(detail.body)
      } catch (error) {
        logger.error(error, `Failed to parse JSON body for requestId: ${requestId}`)
      }
    }

    return detail
  }
}
