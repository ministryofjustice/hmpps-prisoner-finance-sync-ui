import { Request, Response, NextFunction } from 'express'
import AuditController from './auditController'
import AuditService, { Page as AuditPage } from '../services/auditService'
import AuditHistoryService from '../services/auditHistoryService'
import { CursorPage } from '../interfaces/cursorPage'
import { NomisSyncPayloadSummary } from '../interfaces/nomisSyncPayloadSummary'
import { NomisSyncPayloadDetail } from '../interfaces/nomisSyncPayloadDetail'
import type { Services } from '../services'

jest.mock('../services/auditService')
jest.mock('../services/auditHistoryService')

describe('AuditController', () => {
  let auditController: AuditController
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const auditHistoryService = new AuditHistoryService(null) as jest.Mocked<AuditHistoryService>

  beforeEach(() => {
    auditController = new AuditController({ auditService, auditHistoryService } as unknown as Services)

    mockReq = {
      id: 'req-id-123',
      query: {},
      params: {},
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000'),
      originalUrl: '/audit',
    }

    mockRes = {
      locals: { user: { username: 'test-user' } },
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Partial<Response>

    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('history', () => {
    const mockCursorPage: CursorPage<NomisSyncPayloadSummary> = {
      content: [],
      totalElements: 0,
      nextCursor: null,
      size: 20,
    }

    it('should render history page with data when valid queries are provided', async () => {
      mockReq.query = { prisonId: 'BWI', legacyTransactionId: '12345', transactionType: 'TRANSFER_IN' }
      auditHistoryService.getMatchingPayloads.mockResolvedValue(mockCursorPage)

      await auditController.history(mockReq as Request, mockRes as Response, mockNext)

      expect(auditHistoryService.getMatchingPayloads).toHaveBeenCalledWith(
        expect.objectContaining({
          prisonId: 'BWI',
          legacyTransactionId: '12345',
          transactionType: 'TRANSFER_IN',
        }),
      )

      expect(mockRes.render).toHaveBeenCalledWith(
        'pages/audit/history',
        expect.objectContaining({
          prisonId: 'BWI',
          legacyTransactionId: '12345',
          payloadSummaryData: [],
        }),
      )
    })

    it('should catch Zod validation errors, skip service call, and return errors to the view', async () => {
      mockReq.query = { legacyTransactionId: 'bob' }

      await auditController.history(mockReq as Request, mockRes as Response, mockNext)

      expect(auditHistoryService.getMatchingPayloads).not.toHaveBeenCalled()

      expect(mockRes.render).toHaveBeenCalledWith(
        'pages/audit/history',
        expect.objectContaining({
          legacyTransactionId: 'bob',
          errors: [{ href: '#legacyTransactionId', text: 'Transaction ID must be a number' }],
          errorMap: { legacyTransactionId: 'Transaction ID must be a number' },
        }),
      )
    })

    describe('Field specific validations', () => {
      it.each([
        ['prisonId', 'ABCD', 'Prison Id Must be 3 alphanumeric characters'],
        ['prisonId', '12', 'Prison Id Must be 3 alphanumeric characters'],
        [
          'transactionType',
          'lowercase',
          'Transaction Type must be 1-19 capital alphanumeric characters or underscores',
        ],
        [
          'transactionType',
          'TOO_LONG_FOR_THE_SCHEMA_MAX_19',
          'Transaction Type must be 1-19 capital alphanumeric characters or underscores',
        ],
      ])('should validate %s with value "%s" and return error: %s', async (field, value, expectedMessage) => {
        mockReq.query = { [field]: value }

        await auditController.history(mockReq as Request, mockRes as Response, mockNext)

        expect(auditHistoryService.getMatchingPayloads).not.toHaveBeenCalled()
        expect(mockRes.render).toHaveBeenCalledWith(
          'pages/audit/history',
          expect.objectContaining({
            errors: expect.arrayContaining([{ href: `#${field}`, text: expectedMessage }]),
            errorMap: expect.objectContaining({ [field]: expectedMessage }),
          }),
        )
      })
    })

    it('should call next(error) if the service throws an exception', async () => {
      const error = new Error('Boom')
      auditHistoryService.getMatchingPayloads.mockRejectedValue(error)

      await auditController.history(mockReq as Request, mockRes as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockRes.render).not.toHaveBeenCalled()
    })
  })

  describe('detail', () => {
    it('should log page view, fetch payload, and render detail page', async () => {
      mockReq.params = { requestId: '123-abc' }

      const mockPayload: NomisSyncPayloadDetail = {
        requestId: '123-abc',
        timestamp: '2026-01-21T12:00:00Z',
        legacyTransactionId: 12345,
        synchronizedTransactionId: 'abc-123',
        caseloadId: 'MDI',
        requestTypeIdentifier: 'SyncOffenderTransactionRequest',
        body: { some: 'value' },
      }

      auditHistoryService.getPayloadByRequestId.mockResolvedValue(mockPayload)

      await auditController.detail(mockReq as Request, mockRes as Response)

      expect(auditService.logPageView).toHaveBeenCalledWith(AuditPage.AUDIT_DETAIL_PAGE, expect.any(Object))
      expect(auditHistoryService.getPayloadByRequestId).toHaveBeenCalledWith('123-abc')
      expect(mockRes.render).toHaveBeenCalledWith('pages/audit/detail', { auditDetail: mockPayload })
    })
  })
})
