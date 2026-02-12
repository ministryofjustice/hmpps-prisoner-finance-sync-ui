import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import logger from '../../logger'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { CursorPage } from '../interfaces/cursorPage'
import { parseDatePickerStringToIsoString } from '../utils/datePickerUtils'
import { AuditHistorySearchParams } from '../interfaces/auditHistorySearchParams'

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

  async getMatchingPayloads(searchParams: AuditHistorySearchParams): Promise<CursorPage<NomisSyncPayloadSummary>> {
    const { startDate, endDate } = searchParams

    return this.prisonerFinanceSyncApiClient.getPayloadSummary({
      ...searchParams,
      startDate: startDate ? parseDatePickerStringToIsoString(startDate) : null,
      endDate: endDate ? parseDatePickerStringToIsoString(endDate) : null,
    })
  }
}
