export interface NomisSyncPayloadSummary {
  legacyTransactionId?: number
  transactionType: string
  synchronizedTransactionId: string
  caseloadId: string
  timestamp: string
  requestTypeIdentifier?: string
  requestId: string
  transactionTimestamp?: string
}
