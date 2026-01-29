import PrisonerFinanceSyncApiClient from '../data/prisonerFinanceSyncApiClient'
import AuditHistoryService from './auditHistoryService'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { Page } from '../interfaces/page'
import logger from '../../logger'
import { parseDatePickerStringToIsoString } from '../utils/datePickerUtils'

jest.mock('../data/prisonerFinanceSyncApiClient')
jest.mock('../../logger')
jest.mock('../utils/datePickerUtils') // Mock the date parser

describe('AuditHistoryService', () => {
  const apiClient = new PrisonerFinanceSyncApiClient(null) as jest.Mocked<PrisonerFinanceSyncApiClient>
  let service: AuditHistoryService

  beforeEach(() => {
    service = new AuditHistoryService(apiClient)
    ;(parseDatePickerStringToIsoString as jest.Mock).mockImplementation(date => {
      if (date === '01/01/2023') return '2023-01-01'
      if (date === '31/01/2023') return '2023-01-31'
      return date
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getPayloadByRequestId', () => {
    it('should parse the body string into JSON when valid', async () => {
      const requestId = '123e4567-e89b-12d3-a456-426614174000'

      const apiResponse: NomisSyncPayloadDetail = {
        caseloadId: null,
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
        caseloadId: null,
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

  describe('getPayloadSummary', () => {
    const mockPageResponse: Page<NomisSyncPayloadSummary> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      numberOfElements: 0,
      size: 20,
      number: 0,
    }

    it('should convert UI dates to ISO and call the API with correct params', async () => {
      apiClient.getPayloadSummary.mockResolvedValue(mockPageResponse)

      const inputParams = {
        prisonId: 'MDI',
        legacyTransactionId: 12345,
        startDate: '01/01/2023',
        endDate: '31/01/2023',
        page: 2,
        size: 50,
      }

      await service.getPayloadSummary(inputParams)

      expect(apiClient.getPayloadSummary).toHaveBeenCalledWith({
        prisonId: 'MDI',
        legacyTransactionId: 12345,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        page: 2,
        size: 50,
      })
    })

    it('should call the API client with empty parameters when defaults are used', async () => {
      apiClient.getPayloadSummary.mockResolvedValue(mockPageResponse)

      await service.getPayloadSummary({})

      expect(apiClient.getPayloadSummary).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
      })
    })
  })
})
