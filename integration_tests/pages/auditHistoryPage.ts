import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AuditHistoryPage extends AbstractPage {
  readonly header: Locator

  readonly backLink: Locator

  readonly applyFilter: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'NOMIS Sync transaction history' })
    this.backLink = page.locator('.govuk-back-link')
    this.applyFilter = page.getByRole('button', { name: 'Apply filters' }).first()
    this.applyFilter = page.getByRole('button', { name: 'Apply filters' }).first()
  }

  static async verifyOnPage(page: Page): Promise<AuditHistoryPage> {
    const auditHistoryPage = new AuditHistoryPage(page)
    await expect(auditHistoryPage.header).toBeVisible()
    return auditHistoryPage
  }

  async clickApplyFilter(): Promise<void> {
    await Promise.all([this.applyFilter.click()])
  }

  async clickBack(): Promise<void> {
    await this.backLink.click()
  }
}
