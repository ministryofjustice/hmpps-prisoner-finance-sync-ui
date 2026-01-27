import PageResponse from './pageResponse'
import { ApiPageRequest } from '../../interfaces/apiData'
import { Page } from '../../interfaces/page'

type PageLink = {
  text: string
  href: string
}

type NumberedPageLink = {
  text: string
  href: string
  selected?: boolean // default = false
}

type ResultsMetaData = {
  from: number
  to: number
  count: number
}

type PageViewModel = {
  results: ResultsMetaData
  previous: PageLink | null
  next: PageLink | null
  items: NumberedPageLink[] | null
}

export function pageRequestFrom(pageSize: number, page: number): ApiPageRequest {
  return {
    size: pageSize,
    number: page - 1,
  }
}

export default function mojPaginationFromPageResponse(reportPageResponse: Page<unknown>, url: URL): PageViewModel {
  const pageResponse = new PageResponse(
    reportPageResponse.size,
    reportPageResponse.number + 1,
    reportPageResponse.totalElements,
  )
  return {
    results: {
      from: pageResponse.resultsFrom(),
      to: pageResponse.resultsTo(),
      count: pageResponse.totalElements,
    },
    previous: mojPreviousFromPageResponse(pageResponse, url),
    next: mojNextFromPageResponse(pageResponse, url),
    items: mojItemsFromPageResponse(pageResponse, url),
  }
}

function mojItemsFromPageResponse(pageResponse: PageResponse, url: URL): NumberedPageLink[] | null {
  return (
    (!pageResponse.singlePageOfResults() &&
      pageResponse.pageRange(5, 4).map(page => {
        url.searchParams.set('page', page.toString())
        return { text: page.toString(), href: url.href, selected: page === pageResponse.page }
      })) ||
    null
  )
}

function mojPreviousFromPageResponse(pageResponse: PageResponse, url: URL): PageLink | null {
  url.searchParams.set('page', (pageResponse.page - 1).toString())
  return (
    (pageResponse.hasPrevious() && {
      text: 'Previous',
      href: url.href,
    }) ||
    null
  )
}

function mojNextFromPageResponse(pageResponse: PageResponse, url: URL): PageLink | null {
  url.searchParams.set('page', (pageResponse.page + 1).toString())
  return (
    (pageResponse.hasNext() && {
      text: 'Next',
      href: url.href,
    }) ||
    null
  )
}
