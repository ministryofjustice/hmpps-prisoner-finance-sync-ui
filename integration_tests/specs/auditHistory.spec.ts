import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import prisonerFinanceSyncApi from '../mockApis/prisonerFinanceSyncApi'
import AuditHistoryPage from '../pages/auditHistoryPage'

test.describe('Audit History Page', () => {
  const requestId = '07b4e637-79ce-4e17-ab72-c384239576f8'

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Displays the transaction history table with correct data', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)
    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await expect(page.getByText('1234567')).toBeVisible()

    await expect(page.getByText('2026-01-13')).toBeVisible()

    await expect(auditPage.pagination).toBeVisible()
  })

  test('Filters apply correct query parameters', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)
    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await auditPage.filterByDate('24/12/2025', '23/01/2026')

    await expect(page).toHaveURL(/.*startDate=24%2F12%2F2025/)
    await expect(page).toHaveURL(/.*endDate=23%2F01%2F2026/)
  })

  test('Displays single transaction correctly', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)
    await login(page)
    await page.goto(`/audit/`)

    await AuditHistoryPage.verifyOnPage(page)
    await expect(page.getByText('1234567')).toBeVisible()
  })

  test('Displays multiple transactions', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistoryMultipleItems(requestId)
    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await expect(auditPage.tableRows).toHaveCount(2)
  })

  test('Search by Transaction ID updates query parameters', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistorySingleItem(requestId)
    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await auditPage.searchByTransactionId('12345')

    await expect(page).toHaveURL(/.*legacyTransactionId=12345/)
  })

  test('Displays "No results" message when API returns empty', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistoryEmpty()

    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await expect(auditPage.tableRows).toHaveCount(0)
    await expect(auditPage.noResultsMessage).toBeVisible()
    await expect(auditPage.noResultsMessage).toContainText('There are no matching NOMIS synced transactions')
  })

  test('Pagination navigates to the next page', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistoryManyPages()
    await login(page)
    await page.goto(`/audit/`)

    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await auditPage.clickNextPage()

    await expect(page).toHaveURL(/.*page=2/)
    await expect(page).toHaveURL(/.*cursor=cursor-for-page-2/)
  })

  test('Pagination navigates backwards using the previous link', async ({ page }) => {
    await prisonerFinanceSyncApi.stubGetAuditHistoryManyPages()
    await prisonerFinanceSyncApi.stubGetAuditHistoryPageTwo()

    await login(page)
    await page.goto(`/audit/`)
    const auditPage = await AuditHistoryPage.verifyOnPage(page)

    await auditPage.clickNextPage()
    await expect(page).toHaveURL(/.*page=2/)
    await expect(page).toHaveURL(/.*cursor=cursor-for-page-2/)

    await auditPage.clickPreviousPage()

    await expect(page).toHaveURL(/.*page=1/)
    await expect(page).not.toHaveURL(/.*cursor=/)
  })
})
