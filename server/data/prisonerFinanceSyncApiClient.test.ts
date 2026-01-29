import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerFinanceSyncApiClient from './prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'

describe('PrisonerFinanceSyncApiClient', () => {
  let client: PrisonerFinanceSyncApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationClient>

    client = new PrisonerFinanceSyncApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getPayloadByRequestId', () => {
    it('should call the API with the correct request ID', async () => {
      const requestId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedResponse: NomisSyncPayloadDetail = {
        caseloadId: 'MDI',
        requestId,
        synchronizedTransactionId: 'abc',
        timestamp: '2026-01-21T12:00:00Z',
        body: '{"some":"json"}',
      }

      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(expectedResponse)

      const response = await client.getPayloadByRequestId(requestId)

      expect(response).toEqual(expectedResponse)
      expect(getSpy).toHaveBeenCalledWith(
        {
          path: `/audit/history/${requestId}`,
        },
        {
          tokenType: 'SYSTEM_TOKEN',
          user: { username: undefined },
        },
      )
    })
  })

  describe('getPayloadSummary', () => {
    const mockPageResponse = {
      content: [] as NomisSyncPayloadSummary[],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
    }

    it('should call the API with ALL parameters', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({
        prisonId: 'MDI',
        legacyTransactionId: 12345,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        page: 2,
        size: 10,
      })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            prisonId: 'MDI',
            legacyTransactionId: '12345',
            startDate: '2023-01-01',
            endDate: '2023-01-31',
            page: '2',
            size: '10',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with defaults (skipping optional args)', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({})

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with ONLY legacyTransactionId', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({ legacyTransactionId: 9999 })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            legacyTransactionId: '9999',
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with ONLY prisonId', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({ prisonId: 'MDI' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            prisonId: 'MDI',
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with a date range', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({ startDate: '2023-01-01', endDate: '2023-02-01' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            startDate: '2023-01-01',
            endDate: '2023-02-01',
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with only a start date', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({ startDate: '2023-01-01' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            startDate: '2023-01-01',
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with only an end date', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockPageResponse)

      await client.getPayloadSummary({ endDate: '2023-02-02' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            endDate: '2023-02-02',
            page: '0',
            size: '20',
          },
        },
        expect.anything(),
      )
    })
  })
})
