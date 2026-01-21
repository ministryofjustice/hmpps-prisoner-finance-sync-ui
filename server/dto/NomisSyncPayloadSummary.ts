export interface NomisSyncPayloadSummary {
  legacyTransactionId?: number | null
  synchronizedTransactionId: string
  caseloadId?: string | null
  timestamp: Date
  requestTypeIdentifier?: string | null
  requestId: string
  transactionTimestamp?: Date | null
}
