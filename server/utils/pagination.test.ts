import paginationFromPageResponse from './pagination'
import { Page } from '../interfaces/page'

describe('paginationFromPageResponse', () => {
  const baseUrl = new URL('http://localhost/search')

  const createPage = (number: number, totalPages: number, totalElements: number, size = 20): Page<unknown> => ({
    content: [],
    totalElements,
    totalPages,
    number,
    size,
    numberOfElements: size,
  })

  describe('Pagination results summary', () => {
    it('calculates results for the first page', () => {
      const page = createPage(0, 5, 48, 10)
      const result = paginationFromPageResponse(page, baseUrl)

      expect(result.results).toEqual({ from: 1, to: 10, count: 48 })
    })

    it('calculates results for a middle page', () => {
      const page = createPage(1, 5, 48, 10) // Page 2
      const result = paginationFromPageResponse(page, baseUrl)

      expect(result.results).toEqual({ from: 11, to: 20, count: 48 })
    })

    it('calculates results for the last page', () => {
      const page = createPage(4, 5, 48, 10) // Page 5
      const result = paginationFromPageResponse(page, baseUrl)

      expect(result.results).toEqual({ from: 41, to: 48, count: 48 })
    })
  })

  describe('Navigation Links', () => {
    it('generates correct Next link (and no Previous) on first page', () => {
      const page = createPage(0, 5, 50)
      const result = paginationFromPageResponse(page, baseUrl)

      expect(result.previous).toBeNull()
      expect(result.next?.href).toBe('http://localhost/search?page=2')
    })

    it('generates correct Previous link (and no Next) on last page', () => {
      const page = createPage(4, 5, 50)
      const result = paginationFromPageResponse(page, baseUrl)

      expect(result.next).toBeNull()
      expect(result.previous?.href).toBe('http://localhost/search?page=4')
    })

    it('preserves query parameters', () => {
      const url = new URL('http://localhost/search?sort=date&order=desc')
      const page = createPage(0, 5, 50)
      const result = paginationFromPageResponse(page, url)

      expect(result.next?.href).toContain('sort=date')
      expect(result.next?.href).toContain('order=desc')
      expect(result.next?.href).toContain('page=2')
    })
  })

  describe('Pagination Page Numbers', () => {
    it('returns null for single page results', () => {
      const page = createPage(0, 1, 5)
      expect(paginationFromPageResponse(page, baseUrl).items).toBeNull()
    })

    it('shows all pages for small sets (<= 7 pages)', () => {
      const page = createPage(0, 5, 50)
      const items = paginationFromPageResponse(page, baseUrl).items!

      expect(items.map(i => i.text)).toEqual(['1', '2', '3', '4', '5'])
    })

    it('handles Start Pattern (Current page <= 5)', () => {
      // Page 4 of 20 -> [1, 2, 3, 4, 5, ..., 20]
      const page = createPage(3, 20, 200)
      const items = paginationFromPageResponse(page, baseUrl).items!

      expect(items.map(i => i.text)).toEqual(['1', '2', '3', '4', '5', '...', '20'])
      expect(items[3].selected).toBe(true)
    })

    it('handles End Pattern (Current page >= Total - 4)', () => {
      // Page 17 of 20 -> [1, ..., 16, 17, 18, 19, 20]
      const page = createPage(16, 20, 200)
      const items = paginationFromPageResponse(page, baseUrl).items!

      expect(items.map(i => i.text)).toEqual(['1', '...', '16', '17', '18', '19', '20'])
      expect(items[3].selected).toBe(true)
    })

    it('handles Middle Pattern', () => {
      // Page 10 of 20 -> [1, ..., 9, 10, 11, ..., 20]
      const page = createPage(9, 20, 200)
      const items = paginationFromPageResponse(page, baseUrl).items!

      expect(items.map(i => i.text)).toEqual(['1', '...', '9', '10', '11', '...', '20'])
      expect(items[3].selected).toBe(true)
    })
  })
})
