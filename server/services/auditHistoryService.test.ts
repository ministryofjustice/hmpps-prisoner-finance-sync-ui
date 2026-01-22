import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import AuditHistoryService from './auditHistoryService'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import logger from '../../logger'

jest.mock('../data/prisonerFinanceSyncApiClient')
jest.mock('../../logger')

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
    it('should parse the body string into JSON when valid', async () => {
      const requestId = '123e4567-e89b-12d3-a456-426614174000'

      const apiResponse: NomisSyncPayloadDetail = {
        requestId,
        synchronizedTransactionId: 'abc',
        timestamp: '2026-01-21T12:00:00Z',
        body: '{"some":"json"}',
      }

      const expectedResult = {
        ...apiResponse,
        body: { some: 'json' },
      }

      apiClient.getPayloadByRequestId.mockResolvedValue(apiResponse)

      const result = await service.getPayloadByRequestId(requestId)

      expect(apiClient.getPayloadByRequestId).toHaveBeenCalledWith(requestId)
      expect(result).toEqual(expectedResult)
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should return the raw string body and log an error when JSON parsing fails', async () => {
      const requestId = '123e4567-e89b-12d3-a456-426614174000'

      const apiResponse: NomisSyncPayloadDetail = {
        requestId,
        synchronizedTransactionId: 'abc',
        timestamp: '2026-01-21T12:00:00Z',
        body: '{"unclosed_json": "oops"',
      }

      apiClient.getPayloadByRequestId.mockResolvedValue(apiResponse)

      const result = await service.getPayloadByRequestId(requestId)

      expect(result.body).toEqual('{"unclosed_json": "oops"')

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(SyntaxError),
        `Failed to parse JSON body for requestId: ${requestId}`,
      )
    })
  })
})
