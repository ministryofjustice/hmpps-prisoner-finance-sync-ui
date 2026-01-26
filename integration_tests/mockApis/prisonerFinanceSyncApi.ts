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

const getAuditHistorySingleItem = (requestId: string, httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
      queryParameters: {
        startDate: { matches: '.*' },
        endDate: { matches: '.*' },
      },
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            caseloadId: 'BWI',
            legacyTransactionId: 5650123078997200000,
            requestId,
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            synchronizedTransactionId: '23571fdf-0182-452d-aac5-2308ee23fa95',
            timestamp: '2026-01-13T14:53:30.623410Z',
            transactionTimestamp: '2025-06-01T23:08:17Z',
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 1,
        pageable: {
          offset: 0,
          pageNumber: 0,
          pageSize: 20,
          paged: true,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
        },
        size: 20,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        totalElements: 1,
        totalPages: 1,
      },
    },
  })

const getAuditHistoryMultipleItemItems = (requestId: string, httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            caseloadId: 'BWI',
            legacyTransactionId: 56501200,
            requestId,
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            synchronizedTransactionId: '23571fdf-0182-452d-aac5-2308ee23fa95',
            timestamp: '2026-01-13T14:53:30.623410Z',
            transactionTimestamp: '2025-06-01T23:08:17Z',
          },
          {
            caseloadId: 'MDI',
            legacyTransactionId: 565012307,
            requestId,
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            synchronizedTransactionId: '23571fdf-0182-452d-aac5-2308ee23fa9A',
            timestamp: '2026-01-14T14:53:30.623410Z',
            transactionTimestamp: '2025-06-02T23:08:17Z',
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 1,
        pageable: {
          offset: 0,
          pageNumber: 0,
          pageSize: 20,
          paged: true,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
        },
        size: 20,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        totalElements: 1,
        totalPages: 1,
      },
    },
  })

export default {
  stubPing,
  stubGetPayloadDetail: getPayloadDetail,
  stubGetAuditHistorySingleItem: getAuditHistorySingleItem,
  stubGetAuditHistoryMultipleItemItems: getAuditHistoryMultipleItemItems,
}
