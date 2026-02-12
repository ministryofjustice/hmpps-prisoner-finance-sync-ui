import paginationFromCursor from './cursor'
import { CursorPage } from '../../interfaces/cursorPage'

describe('paginationFromCursor', () => {
  const baseUrl = new URL('http://localhost/search')

  const createCursorPage = (
    totalElements: number,
    size: number,
    nextCursor: string | null = null,
  ): CursorPage<unknown> => ({
    content: [],
    totalElements,
    size,
    nextCursor,
  })

  describe('Pagination results summary', () => {
    it('calculates results for the first page', () => {
      const page = createCursorPage(48, 10, 'cursor-2')
      const result = paginationFromCursor(page, baseUrl, '', 1)

      expect(result.results).toEqual({ from: 1, to: 10, count: 48 })
    })

    it('calculates results for a middle page', () => {
      const page = createCursorPage(48, 10, 'cursor-3')
      const result = paginationFromCursor(page, baseUrl, 'cursor-1', 2)

      expect(result.results).toEqual({ from: 11, to: 20, count: 48 })
    })

    it('calculates results for the last page', () => {
      const page = createCursorPage(48, 10, null)
      const result = paginationFromCursor(page, baseUrl, 'cursor-1,cursor-2,cursor-3,cursor-4', 5)

      expect(result.results).toEqual({ from: 41, to: 48, count: 48 })
    })
  })

  describe('Navigation Links', () => {
    it('generates correct Next link (and no Previous) on first page', () => {
      const page = createCursorPage(50, 20, 'next-page-token')
      const result = paginationFromCursor(page, baseUrl, '', 1)

      expect(result.previous).toBeNull()
      expect(result.next?.href).toContain('cursor=next-page-token')
      expect(result.next?.href).toContain('page=2')
      expect(result.next?.href).toContain('prev=')
    })

    it('generates correct Previous link when moving from page 2 back to 1', () => {
      const urlWithCursor = new URL('http://localhost/search?cursor=token-1&page=2')
      const page = createCursorPage(50, 20, 'token-2')
      const result = paginationFromCursor(page, urlWithCursor, '', 2)

      expect(result.previous?.href).not.toContain('cursor=')
      expect(result.previous?.href).toContain('page=1')
      expect(result.previous?.href).not.toContain('prev=')
    })

    it('manages the cursor stack (prev) correctly for multiple pages', () => {
      const url = new URL('http://localhost/search?cursor=token-2&page=3&prev=,token-1')
      const page = createCursorPage(100, 20, 'token-3')

      const result = paginationFromCursor(page, url, ',token-1', 3)

      expect(result.next?.href).toContain('cursor=token-3')
      expect(result.next?.href).toContain('prev=%2Ctoken-1%2Ctoken-2')
      expect(result.previous?.href).toContain('cursor=token-1')
      expect(result.previous?.href).toContain('prev=')
      expect(result.previous?.href).toContain('page=2')
    })

    it('preserves other query parameters', () => {
      const url = new URL('http://localhost/search?prisonId=SWI&size=10')
      const page = createCursorPage(50, 10, 'next-token')
      const result = paginationFromCursor(page, url, '', 1)

      expect(result.next?.href).toContain('prisonId=SWI')
      expect(result.next?.href).toContain('size=10')
      expect(result.next?.href).toContain('cursor=next-token')
    })
  })

  describe('Items list', () => {
    it('always returns null for items as cursor pagination does not support direct page jumping', () => {
      const page = createCursorPage(50, 10, 'token')
      const result = paginationFromCursor(page, baseUrl, '', 1)
      expect(result.items).toBeNull()
    })
  })
})
