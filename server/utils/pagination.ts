import { Page } from '../interfaces/page'

type PageLink = {
  text: string
  href: string
}

type NumberedPageLink = {
  text: string
  href?: string
  selected?: boolean
  type?: 'dots' | 'number'
}

type PageViewModel = {
  results: { from: number; to: number; count: number }
  previous: PageLink | null
  next: PageLink | null
  items: NumberedPageLink[] | null
}

export default function paginationFromPageResponse(pageData: Page<unknown>, url: URL): PageViewModel {
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
  if (total <= 1) return null

  const pages: (number | 'dots')[] = []

  // Logic: Always show 1..5 if we are near the start
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 5) {
    // Start Pattern: 1 2 3 4 5 ... N
    pages.push(1, 2, 3, 4, 5, 'dots', total)
  } else if (current >= total - 4) {
    // End Pattern: 1 ... N-4 N-3 N-2 N-1 N
    pages.push(1, 'dots', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    // Middle Pattern: 1 ... 4 5 6 ... N
    pages.push(1, 'dots', current - 1, current, current + 1, 'dots', total)
  }

  return pages.map(item => {
    if (item === 'dots') {
      return { text: '...', type: 'dots' }
    }
    url.searchParams.set('page', item.toString())
    return {
      text: item.toString(),
      href: url.href,
      selected: item === current,
      type: 'number',
    }
  })
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
