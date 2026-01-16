import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  jest.useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate', 'setTimeout'],
  })
  jest.setSystemTime(new Date('2025-01-01T12:00:00.000'))

  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
  jest.useRealTimers()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(res.text).toContain('The time is currently 01/01/2025, 12:00:00')

        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
