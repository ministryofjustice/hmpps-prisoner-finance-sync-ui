import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerFinanceSyncApiClient from './prisonerFinanceSyncApiClient'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'

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
        caseloadId: null,
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
})
