import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { StatementBalanceResponse } from '../interfaces/statementBalanceResponse'
import { PrisonerAccountResponse } from '../interfaces/prisonerAccountResponse'

export default class GeneralLedgerApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('generalLedgerApi', config.apis.generalLedgerApi, logger, authenticationClient)
  }

  async getPrisonerSubAccountStatementBalances(subAccountId: string): Promise<StatementBalanceResponse[]> {
    return this.get(
      {
        path: `/sub-accounts/${subAccountId}/statementBalances`,
      },
      asSystem(),
    )
  }

  async getPrisonerAccount(prisonNumber: string): Promise<PrisonerAccountResponse[]> {
    return this.get(
      {
        path: `/accounts?`,
        query: { reference: prisonNumber },
      },
      asSystem(),
    )
  }
}
