import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { Page } from '../interfaces/page'
import { PrisonerTransactionResponse } from '../interfaces/prisonerTransactionResponse'
import { datePickerToISODate } from '../utils/datePickerUtils'

export default class PrisonerFinanceApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('prisonerFinanceApi', config.apis.prisonerFinanceApi, logger, authenticationClient)
  }

  async getPrisonerTransactionsByPrisonNumber({
    prisonNumber,
    subAccountReference,
    page = '1',
    startDate,
    endDate,
    debit,
    credit,
  }: {
    prisonNumber: string
    subAccountReference?: string
    page: string
    startDate?: string
    endDate?: string
    debit?: string
    credit?: string
  }): Promise<Page<PrisonerTransactionResponse>> {
    return this.get(
      {
        path: `/prisoners/${prisonNumber}/money/transactions`,
        query: {
          ...(startDate && { startDate: datePickerToISODate(startDate) }),
          ...(endDate && { endDate: datePickerToISODate(endDate) }),
          pageNumber: page,
          pageSize: '999',
          ...(debit && { debit }),
          ...(credit && { credit }),
          ...(subAccountReference && { subAccountReference }),
        },
      },
      asSystem(),
    )
  }
}
