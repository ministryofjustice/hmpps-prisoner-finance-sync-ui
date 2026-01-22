import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import AuditHistoryService from './auditHistoryService'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'

jest.mock('../data/prisonerFinanceSyncApiClient')

describe('AuditHistoryService', () => {
  const apiClient = new PrisonerFinanceSyncApiClient(null) as jest.Mocked<PrisonerFinanceSyncApiClient>
  let service: AuditHistoryService

  beforeEach(() => {
    service = new AuditHistoryService(apiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getPayloadByRequestId', () => {
    it('should call getPayloadByRequestId on the api client with the request ID', async () => {
      const requestId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedResponse: NomisSyncPayloadDetail = {
        requestId,
        synchronizedTransactionId: 'abc',
        timestamp: '2026-01-21T12:00:00Z',
        body: '{"some":"json"}',
      }

      apiClient.getPayloadByRequestId.mockResolvedValue(expectedResponse)

      const result = await service.getPayloadByRequestId(requestId)

      expect(apiClient.getPayloadByRequestId).toHaveBeenCalledTimes(1)
      expect(apiClient.getPayloadByRequestId).toHaveBeenCalledWith(requestId)
      expect(result).toEqual(expectedResponse)
    })
  })
})
