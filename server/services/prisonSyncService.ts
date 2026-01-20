import { NomisSyncPayloadDto } from "../dto/nomisSyncPayload"
import { v4 as uuidv4 } from 'uuid'

export default class PrisonSyncService {

    async getTransactionData(searchValue: string): Promise<NomisSyncPayloadDto[]>
    {
        const now = new Date()

        return [
            {
            timestamp: now,
            legacyTransactionId: Number(searchValue),
            synchronizedTransactionId: uuidv4(),
            requestId: uuidv4(),
            caseloadId: 'BWI',
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            transactionTimestamp: now
            }
        ]
    }
}
