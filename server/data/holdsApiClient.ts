import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../logger'
import config from '../config'
import { PrisonerHoldResponse } from '../interfaces/PrisonerHoldResponse'
import { Page } from '../interfaces/page'

export default class HoldsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('holdsApi', config.apis.holdsApi, logger, authenticationClient)
  }

  async getPrisonerHolds(prisonNumber: string): Promise<Page<PrisonerHoldResponse[]>> {
    return this.get(
      {
        path: `/holds/${prisonNumber}`,
        query: {
          pageNumber: 1,
          pageSize: '999',
        },
      },
      asSystem(),
    )
  }
}
