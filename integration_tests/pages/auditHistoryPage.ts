import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AuditHistoryPage extends AbstractPage {
  readonly header: Locator

  readonly searchInput: Locator

  readonly searchButton: Locator

  readonly startDateInput: Locator

  readonly endDateInput: Locator

  readonly applyFiltersButton: Locator

  readonly noResultsMessage: Locator

  readonly tableRows: Locator

  readonly pagination: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'NOMIS Sync transaction history' })

    this.searchInput = page.locator('#legacyTransactionId')
    this.searchButton = page.getByRole('button', { name: 'Search' })

    this.startDateInput = page.locator('#startDate')
    this.endDateInput = page.locator('#endDate')
    this.applyFiltersButton = page.getByRole('button', { name: 'Apply filters' }).first()
    this.tableRows = page.locator('.govuk-table__body .govuk-table__row')
    this.pagination = page.locator('.moj-pagination').first()
    this.noResultsMessage = page.locator('ul[name="no-results-message"]')
  }

  static async verifyOnPage(page: Page): Promise<AuditHistoryPage> {
    const auditHistoryPage = new AuditHistoryPage(page)
    await expect(auditHistoryPage.header).toBeVisible()
    return auditHistoryPage
  }

  async filterByDate(from: string, to: string) {
    await this.startDateInput.fill(from)
    await this.endDateInput.fill(to)
    await this.applyFiltersButton.click()
  }

  async searchByTransactionId(id: string): Promise<void> {
    await this.searchInput.fill(id)
    await this.searchButton.click()
  }

  async clickNextPage(): Promise<void> {
    await this.pagination.locator('.moj-pagination__item--next a').click()
  }
}
