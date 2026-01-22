import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import AuditHistoryService from '../services/auditHistoryService'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'

jest.mock('../services/auditService')
jest.mock('../services/auditHistoryService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const auditHistoryService = new AuditHistoryService(null) as jest.Mocked<AuditHistoryService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      auditHistoryService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page with the correct card', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Prisoner Finance Sync')
        expect(res.text).toContain('View audit history')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INDEX_PAGE, expect.anything())
      })
  })
})

describe('GET /audit/:requestId', () => {
  const requestId = '07b4e637-79ce-4e17-ab72-c384239576f8'

  it('should render the detail page with parsed JSON body', () => {
    const mockPayload: NomisSyncPayloadDetail = {
      requestId,
      timestamp: '2026-01-21T12:00:00Z',
      legacyTransactionId: 12345,
      synchronizedTransactionId: 'abc-123',
      caseloadId: 'MDI',
      requestTypeIdentifier: 'Offender Transaction',
      body: { some: 'value' },
    }

    auditHistoryService.getPayloadByRequestId.mockResolvedValue(mockPayload)
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get(`/audit/${requestId}`)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Payload Detail')
        expect(res.text).toContain('MDI')
        expect(res.text).toContain('Offender Transaction')
        expect(res.text).toContain('&quot;some&quot;')
      })
      .expect(() => {
        expect(auditHistoryService.getPayloadByRequestId).toHaveBeenCalledWith(requestId)
      })
  })

  it('should handle API errors (e.g. 404 Not Found)', () => {
    const error = new Error('Not Found')
    // @ts-expect-error: status property does not exist on Error type
    error.status = 404
    auditHistoryService.getPayloadByRequestId.mockRejectedValue(error)

    return request(app).get(`/audit/${requestId}`).expect(404)
  })

  it('should handle API errors (e.g. 500)', () => {
    auditHistoryService.getPayloadByRequestId.mockRejectedValue(new Error('API Error'))

    return request(app).get(`/audit/${requestId}`).expect(500)
  })
})
