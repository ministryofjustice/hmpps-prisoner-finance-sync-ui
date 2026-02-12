import { Page } from '../../interfaces/page'
import { PaginationViewModel, PageLink, NumberedPageLink } from './types'

export default function paginationFromPageResponse(pageData: Page<unknown>, url: URL): PaginationViewModel {
  const currentPage = pageData.number + 1
  const pageSize = pageData.size
  const { totalElements } = pageData
  const { totalPages } = pageData

  const resultsFrom = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const resultsTo = Math.min(totalElements, currentPage * pageSize)

  return {
    results: {
      from: resultsFrom,
      to: resultsTo,
      count: totalElements,
    },
    previous: getPreviousLink(currentPage, url),
    next: getNextLink(currentPage, totalPages, url),
    items: getPaginationItems(currentPage, totalPages, url),
  }
}

function getPaginationItems(current: number, total: number, url: URL): NumberedPageLink[] | null {
  // Only hide pagination if there is 1 page or fewer
  if (total <= 1) return null

  const items = calculatePageItems(current, total)

  return items.map((item: string | number) => {
    if (item === 'dots') {
      return { text: '...', type: 'dots' }
    }

    const linkUrl = new URL(url.toString())
    linkUrl.searchParams.set('page', item.toString())

    return {
      text: item.toString(),
      href: linkUrl.href,
      selected: item === current,
      type: 'number',
    }
  })
}

/**
 * Calculates the list of page numbers and 'dots' (ellipses) to display in the pagination component.
 *
 * The logic is defined by 4 constants:
 * - MAX_VISIBLE_PAGES (7): If total pages are <= 7, show all of them.
 * - START_EDGE_COUNT (5): If near the start, show the first 5 pages.
 * - END_EDGE_OFFSET (4): If near the end, show the last 5 pages (Total - 4).
 * - PAGES_AROUND_CURRENT (1): In the middle, show current page +/- 1 neighbor.
 *
 * Examples (Total Pages = 100):
 * 1. Start Pattern (Current <= 5):
 * [1, 2, 3, 4, 5, ..., 100]
 *
 * 2. End Pattern (Current >= 96):
 * [1, ..., 96, 97, 98, 99, 100]
 *
 * 3. Middle Pattern (Current = 50):
 * [1, ..., 49, 50, 51, ..., 100]
 *
 * 4. Small Result Set (Total = 5):
 * [1, 2, 3, 4, 5]
 */
const MAX_VISIBLE_PAGES = 7
const START_EDGE_COUNT = 5
const END_EDGE_OFFSET = 4
const PAGES_AROUND_CURRENT = 1

function calculatePageItems(current: number, total: number): (number | 'dots')[] {
  const range = (start: number, count: number) => Array.from({ length: count }, (_, i) => start + i)

  if (total <= MAX_VISIBLE_PAGES) {
    return range(1, total)
  }

  if (current <= START_EDGE_COUNT) {
    return [...range(1, START_EDGE_COUNT), 'dots', total]
  }

  if (current >= total - END_EDGE_OFFSET) {
    return [1, 'dots', ...range(total - END_EDGE_OFFSET, END_EDGE_OFFSET + 1)]
  }

  return [1, 'dots', ...range(current - PAGES_AROUND_CURRENT, PAGES_AROUND_CURRENT * 2 + 1), 'dots', total]
}

function getPreviousLink(current: number, url: URL): PageLink | null {
  if (current <= 1) return null
  url.searchParams.set('page', (current - 1).toString())
  return { text: 'Previous', href: url.href }
}

function getNextLink(current: number, total: number, url: URL): PageLink | null {
  if (current >= total) return null
  url.searchParams.set('page', (current + 1).toString())
  return { text: 'Next', href: url.href }
}
