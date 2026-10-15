import HoldsApiClient from '../data/holdsApiClient'

export default class HoldsService {
  constructor(private readonly holdsApiClient: HoldsApiClient) {}

  getHolds(prisonNumber: string) {
    return this.holdsApiClient.getPrisonerHolds(prisonNumber)
  }
}
