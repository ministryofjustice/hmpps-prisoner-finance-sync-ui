import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
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
        expect(res.text).toContain('View captured synchronisation history')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })

  it('should handle audit service errors gracefully', () => {
    auditService.logPageView.mockRejectedValue(new Error('Audit logging failed'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(200)
        expect(res.text).toContain('Prisoner Finance Sync')
      })
  })
})
