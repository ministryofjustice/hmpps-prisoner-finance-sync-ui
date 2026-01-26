import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { randomUUID } from 'crypto'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page as AuditPage } from '../services/auditService'
import { Page } from '../interfaces/page'
import AuditHistoryService from '../services/auditHistoryService'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { formatDatePickerDate } from '../utils/datePickerUtils'

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
        expect(auditService.logPageView).toHaveBeenCalledWith(AuditPage.INDEX_PAGE, expect.anything())
      })
  })
})

describe('GET /audit', () => {
  const todaysDate = new Date()

  const mockPayload: Page<NomisSyncPayloadSummary> = {
    content: [
      {
        legacyTransactionId: 12345,
        synchronizedTransactionId: randomUUID().toString(),
        caseloadId: 'BWI',
        timestamp: todaysDate.toISOString(),
        requestTypeIdentifier: 'OffenderTransaction',
        requestId: randomUUID().toString(),
        transactionTimestamp: new Date().toISOString(),
      },
    ],
    totalElements: 2,
    totalPages: 1,
    numberOfElements: 2,
    number: 0,
    size: 20,
  }

  it('should render the audit history page with the default - no filters', () => {
    auditHistoryService.getPayloadSummary.mockResolvedValue(mockPayload)
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/audit')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('h1').text()).toContain('NOMIS Sync transaction history')

        expect($('[name="startDate"]').val()).toEqual('')
        expect($('[name="endDate"]').val()).toEqual('')
        expect($('[name="legacyTransactionId"]').val()).toEqual('')

        const tableData = $('tbody tr')
          .map((i, row) => {
            return [
              $(row)
                .find('td')
                .map((j, cell) => $(cell).text().trim())
                .get(),
            ]
          })
          .get()

        expect(tableData).toEqual([
          [
            mockPayload.content[0].legacyTransactionId.toString(),
            mockPayload.content[0].synchronizedTransactionId,
            mockPayload.content[0].caseloadId,
            mockPayload.content[0].timestamp,
            mockPayload.content[0].requestTypeIdentifier,
            'View',
          ],
        ])
      })
  })

  it('should render results filtered by legacy transaction Id', () => {
    auditHistoryService.getPayloadSummary.mockResolvedValue(mockPayload)
    auditService.logPageView.mockResolvedValue(null)

    const query = 'legacyTransactionId=678910'

    return request(app)
      .get(`/audit?${query}`)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        const $ = cheerio.load(res.text)

        expect($('[name="legacyTransactionId"]').val()).toEqual('678910')
      })
      .expect(() => {
        expect(auditHistoryService.getPayloadSummary).toHaveBeenCalledWith({
          prisonId: '',
          legacyTransactionId: 678910,
          startDate: null,
          endDate: null,
        })
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
        const $ = cheerio.load(res.text)

        expect($('h1').text()).toContain('Payload Detail')
        expect($('.govuk-summary-list').text()).toContain('MDI')
        expect($('.govuk-summary-list').text()).toContain('Offender Transaction')
        expect($('pre').text()).toContain('"some": "value"')
      })
      .expect(() => {
        expect(auditHistoryService.getPayloadByRequestId).toHaveBeenCalledWith(requestId)
      })
  })

  it('should handle API errors (e.g. 404 Not Found)', () => {
    const error = Object.assign(new Error('Not Found'), { status: 404 })
    auditHistoryService.getPayloadByRequestId.mockRejectedValue(error)

    return request(app).get(`/audit/${requestId}`).expect(404)
  })

  it('should handle API errors (e.g. 500)', () => {
    auditHistoryService.getPayloadByRequestId.mockRejectedValue(new Error('API Error'))

    return request(app).get(`/audit/${requestId}`).expect(500)
  })
})
