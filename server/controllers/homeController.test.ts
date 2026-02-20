import { Request, Response } from 'express'
import HomeController from './homeController'
import AuditService, { Page as AuditPage } from '../services/auditService'
import type { Services } from '../services'

jest.mock('../services/auditService')

describe('HomeController', () => {
  let homeController: HomeController
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>

  const auditService = new AuditService(null) as jest.Mocked<AuditService>

  beforeEach(() => {
    homeController = new HomeController({ auditService } as unknown as Services)

    mockReq = {
      id: '123',
    }

    mockRes = {
      locals: { user: { username: 'test-user' } },
      render: jest.fn(),
    } as unknown as Partial<Response>
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('index', () => {
    it('should log page view for INDEX_PAGE and render the home page', async () => {
      await homeController.index(mockReq as Request, mockRes as Response)

      expect(auditService.logPageView).toHaveBeenCalledWith(AuditPage.INDEX_PAGE, {
        who: 'test-user',
        correlationId: '123',
      })
      expect(mockRes.render).toHaveBeenCalledWith('pages/index')
    })
  })
})
