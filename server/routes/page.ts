import { SubjectType } from '../data/hmppsAuditClient'

enum AuditPage {
  INDEX_PAGE = 'INDEX_PAGE',
  AUDIT_HISTORY_PAGE = 'AUDIT_HISTORY_PAGE',
  AUDIT_DETAIL_PAGE = 'AUDIT_DETAIL_PAGE',
  AUDIT_COMBINED_TRANSACTIONS_PAGE = 'AUDIT_COMBINED_TRANSACTIONS_PAGE',
  AUDIT_HOLDS_PAGE = 'AUDIT_HOLDS_PAGE',
}

export interface AuditEventDetails {
  who: string
  subjectId?: string
  subjectType?: SubjectType
  correlationId?: string
  details?: object
}

export interface AuditEvent {
  what: string
  who: string
  subjectId?: string
  subjectType?: SubjectType
  correlationId?: string
  details?: object
}

export default AuditPage
