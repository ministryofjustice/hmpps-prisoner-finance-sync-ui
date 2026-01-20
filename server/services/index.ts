import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'
import PrisonSyncService from './prisonSyncService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    prisonSyncService: new PrisonSyncService(),
  }
}

export type Services = ReturnType<typeof services>
