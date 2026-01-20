export interface NomisSyncPayloadDto {
  timestamp: Date
  legacyTransactionId?: number | null
  synchronizedTransactionId: string
  requestId: string
  caseloadId?: string | null
  requestTypeIdentifier?: string | null
  transactionTimestamp?: Date | null
}
