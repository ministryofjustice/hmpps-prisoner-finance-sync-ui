import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import logger from '../../logger'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { Page } from '../interfaces/page'
import { parseDatePickerStringToIsoString } from '../utils/datePickerUtils'

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

  async getPayloadSummary(startDate: string, endDate: string, query: string): Promise<Page<NomisSyncPayloadSummary>> {
    const startDateIso = parseDatePickerStringToIsoString(startDate)
    const endDateIso = parseDatePickerStringToIsoString(endDate)

    const payloadSummary = (await this.prisonerFinanceSyncApiClient.getPayloadSummary(null, startDateIso, endDateIso))

    return payloadSummary
  }
}
