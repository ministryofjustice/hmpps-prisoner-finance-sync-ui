import HmppsAuditClient, { SubjectType } from '../data/hmppsAuditClient'
import AuditPage, { AuditEvent } from '../routes/page'

export interface AuditEventDetails {
  who: string
  subjectId?: string
  subjectType?: SubjectType
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: AuditPage, eventDetails: AuditEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
