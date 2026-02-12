import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerFinanceSyncApiClient from './prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { CursorPage } from '../interfaces/cursorPage'

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
    const mockCursorPageResponse: CursorPage<NomisSyncPayloadSummary> = {
      content: [] as NomisSyncPayloadSummary[],
      totalElements: 0,
      nextCursor: null,
      size: 20,
    }

    it('should call the API with ALL parameters', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({
        prisonId: 'MDI',
        legacyTransactionId: 12345,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        cursor: 'some-cursor-token',
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
            cursor: 'some-cursor-token',
            size: '10',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with defaults (skipping optional args)', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({})

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with ONLY legacyTransactionId', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({ legacyTransactionId: 9999 })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            legacyTransactionId: '9999',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with ONLY prisonId', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({ prisonId: 'MDI' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            prisonId: 'MDI',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with a date range', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({ startDate: '2023-01-01', endDate: '2023-02-01' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            startDate: '2023-01-01',
            endDate: '2023-02-01',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with only a start date', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({ startDate: '2023-01-01' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            startDate: '2023-01-01',
            size: '20',
          },
        },
        expect.anything(),
      )
    })

    it('should call the API with only an end date', async () => {
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockCursorPageResponse)

      await client.getPayloadSummary({ endDate: '2023-02-02' })

      expect(getSpy).toHaveBeenCalledWith(
        {
          path: '/audit/history',
          query: {
            endDate: '2023-02-02',
            size: '20',
          },
        },
        expect.anything(),
      )
    })
  })
})
