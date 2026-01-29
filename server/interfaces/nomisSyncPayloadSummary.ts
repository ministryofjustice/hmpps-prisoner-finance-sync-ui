export interface NomisSyncPayloadSummary {
  legacyTransactionId?: number
  synchronizedTransactionId: string
  caseloadId: string
  timestamp: string
  requestTypeIdentifier?: string
  requestId: string
  transactionTimestamp?: string
}
