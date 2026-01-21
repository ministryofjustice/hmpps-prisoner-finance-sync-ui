import { v4 as uuidv4 } from 'uuid'
import { NomisSyncPayloadDto } from '../dto/nomisSyncPayload'

export default class PrisonSyncService {
  async getTransactionData(dateFrom: string, dateTo: string, query: string): Promise<NomisSyncPayloadDto[]> {
    const now = new Date()

    return [
      {
        timestamp: now,
        legacyTransactionId: Number(query),
        synchronizedTransactionId: uuidv4(),
        requestId: uuidv4(),
        caseloadId: 'BWI',
        requestTypeIdentifier: 'SyncOffenderTransactionRequest',
        transactionTimestamp: now,
      },
    ]
  }
}
