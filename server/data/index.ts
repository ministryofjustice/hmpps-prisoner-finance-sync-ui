import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import PrisonerFinanceSyncApiClient from './prisonerFinanceSyncApiClient'
import PrisonerFinanceApiClient from './prisonerFinanceApiClient'
import GeneralLedgerApiClient from './generalLedgerApiClient'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    prisonerFinanceSyncApiClient: new PrisonerFinanceSyncApiClient(hmppsAuthClient),
    prisonerFinanceApiClient: new PrisonerFinanceApiClient(hmppsAuthClient),
    generalLedgerApiClient: new GeneralLedgerApiClient(hmppsAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, PrisonerFinanceSyncApiClient, PrisonerFinanceApiClient }
