import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  INDEX_PAGE = 'INDEX_PAGE',
  AUDIT_HISTORY_PAGE = 'AUDIT_HISTORY_PAGE',
  AUDIT_DETAIL_PAGE = 'AUDIT_DETAIL_PAGE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
