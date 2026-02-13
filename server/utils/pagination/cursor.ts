import { PaginationViewModel } from './types'
import { CursorPage } from '../../interfaces/cursorPage'

export default function paginationFromCursor(
  { totalElements, size, nextCursor }: CursorPage<unknown>,
  currentUrl: URL,
  prevCursors: string,
  currentPage: number,
): PaginationViewModel {
  const history = prevCursors ? prevCursors.split(',') : []

  const getUrl = (page: number, cursor?: string, newHistory: string[] = []) => {
    const url = new URL(currentUrl.toString())
    url.searchParams.set('page', page.toString())

    if (cursor) {
      url.searchParams.set('cursor', cursor)
    } else {
      url.searchParams.delete('cursor')
    }

    if (newHistory.length > 0) {
      url.searchParams.set('prev', newHistory.join(','))
    } else {
      url.searchParams.delete('prev')
    }

    return url.href
  }

  return {
    results: {
      from: (currentPage - 1) * size + 1,
      to: Math.min(totalElements, Number(currentPage) * size),
      count: totalElements,
    },
    previous:
      currentPage > 1
        ? { text: 'Previous', href: getUrl(currentPage - 1, history.at(-1), history.slice(0, -1)) }
        : null,
    next: nextCursor
      ? {
          text: 'Next',
          href: getUrl(currentPage + 1, nextCursor, [...history, currentUrl.searchParams.get('cursor') || '']),
        }
      : null,
    items: null,
  }
}
