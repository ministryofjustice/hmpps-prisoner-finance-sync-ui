import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import logger from '../../logger'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { Page } from '../interfaces/page'
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

  async getPayloadSummary(searchParams: AuditHistorySearchParams): Promise<Page<NomisSyncPayloadSummary>> {
    const { prisonId, legacyTransactionId, startDate, endDate, page, size } = searchParams

    const startDateIso = parseDatePickerStringToIsoString(startDate)
    const endDateIso = parseDatePickerStringToIsoString(endDate)

    return this.prisonerFinanceSyncApiClient.getPayloadSummary({
      prisonId,
      legacyTransactionId,
      startDate: startDateIso,
      endDate: endDateIso,
      page,
      size,
    })
  }
}
