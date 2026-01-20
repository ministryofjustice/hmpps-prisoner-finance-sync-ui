import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class IndexPage extends AbstractPage {
  readonly header: Locator

  readonly auditHistoryCard: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Prisoner Finance Sync' })

    this.auditHistoryCard = page.locator('[data-qa="audit-history-card"]')
  }

  static async verifyOnPage(page: Page): Promise<IndexPage> {
    const homePage = new IndexPage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }

  async clickAuditHistory(): Promise<void> {
    await this.auditHistoryCard.click()
  }
}
