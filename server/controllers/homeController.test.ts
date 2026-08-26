import { Request, Response } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import HomeController from './homeController'
import type { Services } from '../services'
import Page from '../routes/page'

jest.mock('@ministryofjustice/hmpps-audit-client')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>

describe('HomeController', () => {
  let homeController: HomeController
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>

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

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.INDEX_PAGE, {
        who: 'test-user',
        correlationId: '123',
      })
      expect(mockRes.render).toHaveBeenCalledWith('pages/index')
    })
  })
})
