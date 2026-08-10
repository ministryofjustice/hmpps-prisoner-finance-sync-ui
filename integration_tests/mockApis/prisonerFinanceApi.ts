import { stubFor } from './wiremock'

const stubPing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-finance-api/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  stubPing,
}
