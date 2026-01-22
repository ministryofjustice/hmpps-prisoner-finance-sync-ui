import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AuditDetailPage extends AbstractPage {
  readonly header: Locator

  readonly backLink: Locator

  readonly jsonViewer: Locator

  readonly summaryList: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Payload Detail' })
    this.backLink = page.locator('.govuk-back-link')
    this.jsonViewer = page.locator('.app-json-viewer code')
    this.summaryList = page.locator('.govuk-summary-list')
  }

  static async verifyOnPage(page: Page): Promise<AuditDetailPage> {
    const detailPage = new AuditDetailPage(page)
    await expect(detailPage.header).toBeVisible()
    return detailPage
  }

  async getSummaryListValue(key: string): Promise<string> {
    return this.summaryList
      .locator('.govuk-summary-list__row', { hasText: key })
      .locator('.govuk-summary-list__value')
      .innerText()
  }

  async clickBack(): Promise<void> {
    await this.backLink.click()
  }
}
