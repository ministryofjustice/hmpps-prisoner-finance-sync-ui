import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import AuditDetailPage from '../pages/auditDetailPage'
import prisonerFinanceSyncApi from '../mockApis/prisonerFinanceSyncApi'

test.describe('Audit Detail Page', () => {
  const requestId = '07b4e637-79ce-4e17-ab72-c384239576f8'

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Loads the detail page and displays correct data', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetPayloadDetail(requestId)

    await login(page)

    await page.goto(`/audit/${requestId}`)

    const detailPage = await AuditDetailPage.verifyOnPage(page)

    expect(await detailPage.getSummaryListValue('Request Type')).toContain('Offender Transaction')
    expect(await detailPage.getSummaryListValue('Prison (Caseload)')).toContain('MDI')

    await expect(detailPage.jsonViewer).toBeVisible()
    await expect(detailPage.jsonViewer).toContainText('"offenderNo": "A1234AA"')
  })

  test('Back link navigates to the correct url', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetPayloadDetail(requestId)
    await login(page)

    await page.goto(`/audit/${requestId}`)
    const detailPage = await AuditDetailPage.verifyOnPage(page)

    await detailPage.clickBack()

    await expect(page).toHaveURL(/\/audit-history/)
  })
})
