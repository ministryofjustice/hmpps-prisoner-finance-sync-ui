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
        size: { equalTo: '20' },
      },
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            caseloadId: 'BWI',
            legacyTransactionId: 1234567,
            requestId,
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            synchronizedTransactionId: '23571fdf-0182-452d-aac5-2308ee23fa95',
            timestamp: '2026-01-13T14:53:30.623410Z',
            transactionTimestamp: '2025-06-01T23:08:17Z',
          },
        ],
        totalElements: 1,
        nextCursor: null,
        size: 20,
      },
    },
  })

const getAuditHistoryMultipleItems = (requestId: string, httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
      queryParameters: {
        size: { equalTo: '20' },
      },
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
        totalElements: 2,
        nextCursor: null,
        size: 20,
      },
    },
  })

const getAuditHistoryEmpty = (httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [],
        totalElements: 0,
        nextCursor: null,
        size: 20,
      },
    },
  })

const getAuditHistoryManyPages = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
      queryParameters: {
        size: { equalTo: '20' },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            caseloadId: 'MDI',
            legacyTransactionId: 1234567,
            requestId: '65372332',
            requestTypeIdentifier: 'SyncOffenderTransactionRequest',
            synchronizedTransactionId: '23571fdf-0182-452d-aac5-2308ee23fa95',
            timestamp: '2026-01-13T14:53:30.623410Z',
            transactionTimestamp: '2025-06-01T23:08:17Z',
          },
        ],
        totalElements: 25,
        nextCursor: 'cursor-for-page-2',
        size: 20,
      },
    },
  })

const getAuditHistoryPageTwo = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/prisoner-finance-sync-api/audit/history`,
      queryParameters: {
        cursor: { equalTo: 'cursor-for-page-2' },
        size: { equalTo: '20' },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [{}],
        totalElements: 25,
        nextCursor: 'cursor-for-page-3',
        size: 20,
      },
    },
  })

export default {
  stubPing,
  stubGetPayloadDetail: getPayloadDetail,
  stubGetAuditHistorySingleItem: getAuditHistorySingleItem,
  stubGetAuditHistoryMultipleItems: getAuditHistoryMultipleItems,
  stubGetAuditHistoryEmpty: getAuditHistoryEmpty,
  stubGetAuditHistoryManyPages: getAuditHistoryManyPages,
  stubGetAuditHistoryPageTwo: getAuditHistoryPageTwo,
}
