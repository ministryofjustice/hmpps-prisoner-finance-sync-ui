import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import IndexPage from '../pages/indexPage'

test.describe('Index Page', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Dashboard loads with Audit History card', async ({ page }) => {
    await login(page)

    const indexPage = await IndexPage.verifyOnPage(page)

    await expect(indexPage.auditHistoryCard).toBeVisible()
    await expect(indexPage.auditHistoryCard).toContainText('View audit history')

    await indexPage.clickAuditHistory()
    await expect(page).toHaveURL(/\/audit/)
  })
})
