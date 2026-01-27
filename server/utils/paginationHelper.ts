export interface Pagination {
  results: {
    from: number
    to: number
    count: number
  }
  previous?: {
    text: string
    href: string
  }
  next?: {
    text: string
    href: string
  }
  items: {
    number?: number
    href?: string
    current?: boolean
    ellipsis?: boolean
  }[]
}

export const getPagination = (
  currentPage: number,
  totalPages: number,
  currentUrl: string,
  pageSize = 20,
  windowSize = 2,
): Pagination => {
  const url = new URL(`http://localhost${currentUrl}`)
  const params = new URLSearchParams(url.search)

  const createUrl = (page: number) => {
    params.set('page', page.toString())
    return `?${params.toString()}`
  }

  const potentialPages = [1, totalPages]

  for (let i = currentPage - windowSize; i <= currentPage + windowSize; i += 1) {
    potentialPages.push(i)
  }

  const uniquePages = [...new Set(potentialPages)].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items: Pagination['items'] = []
  let previousPage: number | null = null

  for (const page of uniquePages) {
    if (previousPage) {
      if (page - previousPage === 2) {
        const missingPage = previousPage + 1
        items.push({
          number: missingPage,
          href: createUrl(missingPage),
          current: false,
        })
      } else if (page - previousPage > 1) {
        items.push({ ellipsis: true })
      }
    }

    items.push({
      number: page,
      href: createUrl(page),
      current: page === currentPage,
    })

    previousPage = page
  }

  const pagination: Pagination = {
    results: {
      from: (currentPage - 1) * pageSize + 1,
      to: Math.min(currentPage * pageSize, totalPages * pageSize),
      count: totalPages * pageSize,
    },
    items,
  }

  if (currentPage > 1) {
    pagination.previous = {
      text: 'Previous',
      href: createUrl(currentPage - 1),
    }
  }

  if (currentPage < totalPages) {
    pagination.next = {
      text: 'Next',
      href: createUrl(currentPage + 1),
    }
  }

  return pagination
}
