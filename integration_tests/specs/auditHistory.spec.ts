import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import prisonerFinanceSyncApi from '../mockApis/prisonerFinanceSyncApi'
import AuditHistoryPage from '../pages/auditHistoryPage'

test.describe('Audit History Page', () => {
  const requestId = '07b4e637-79ce-4e17-ab72-c384239576f8'

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Loads the audit history page and displays correct data', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)

    await login(page)

    await page.goto(`/audit/`)

    await AuditHistoryPage.verifyOnPage(page)
  })

  test('Loads the audit history page and displays multiple transactions', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)

    await login(page)

    await page.goto(`/audit/`)

    await AuditHistoryPage.verifyOnPage(page)
  })

  test('Loads the audit history page and displays one returned transaction', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)

    await login(page)

    await page.goto(`/audit/?dateFrom=24%2F12%2F2025&dateTo=23%2F01%2F2026&query=`)

    const auditHistory = await AuditHistoryPage.verifyOnPage(page)

    await expect(auditHistory.applyFilter).toBeEnabled()

    await auditHistory.clickApplyFilter()

    await expect(page).toHaveURL(/\/audit\/\?legacyTransactionId=.*&startDate=.*&endDate=.*/)
  })
})
