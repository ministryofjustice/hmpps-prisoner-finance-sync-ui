import GeneralLedgerApiClient from "../data/generalLedgerApiClient"

export default class GeneralLedgerService {
    constructor(private readonly generalLedgerApiClient: GeneralLedgerApiClient) { }

    getPrisonerSubAccountStatementBalances(subAccountId: string) {
        return this.generalLedgerApiClient.getPrisonerSubAccountStatementBalances(subAccountId)
    }

    getPrisonerAccount(prisonNumber: string) {
        return this.generalLedgerApiClient.getPrisonerAccount(prisonNumber)
    }
}