import { stubFor } from './wiremock'

const stubPing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-finance-sync-api/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

const getPayloadDetail = (requestId: string, httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisoner-finance-sync-api/audit/history/${requestId}`,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        requestId,
        timestamp: '2026-01-21T12:00:00Z',
        legacyTransactionId: 12345,
        synchronizedTransactionId: 'abc-123-xyz',
        caseloadId: 'MDI',
        requestTypeIdentifier: 'Offender Transaction',
        transactionTimestamp: '2025-01-21T12:00:00Z',
        body: JSON.stringify({ offenderNo: 'A1234AA', amount: 50.0 }),
      },
    },
  })

export default {
  stubPing,
  stubGetPayloadDetail: getPayloadDetail,
}
