import PrisonerFinanceApiClient from '../data/prisonerFinanceApiClient'
import { Page } from '../interfaces/page'
import { PrisonerTransactionResponse } from '../interfaces/prisonerTransactionResponse'

export default class PrisonerFinanceService {
  constructor(private readonly prisonerFinanceApiClient: PrisonerFinanceApiClient) {}

  getPrisonerTransactionsByPrisonNumber({
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
    return this.prisonerFinanceApiClient.getPrisonerTransactionsByPrisonNumber({
      prisonNumber,
      subAccountReference,
      startDate,
      endDate,
      page,
      debit,
      credit,
    })
  }
}
