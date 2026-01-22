export interface NomisSyncPayloadDetail {
  legacyTransactionId?: number
  synchronizedTransactionId: string
  caseloadId?: string
  timestamp: string
  requestTypeIdentifier?: string
  requestId: string
  transactionTimestamp?: string
  body: string | Record<string, unknown>
}
