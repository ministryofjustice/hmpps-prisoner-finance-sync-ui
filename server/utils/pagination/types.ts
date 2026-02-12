export type PageLink = {
  text: string
  href: string
}

export type NumberedPageLink = {
  text: string
  href?: string
  selected?: boolean
  type?: 'dots' | 'number'
}

export type PaginationViewModel = {
  results?: { from: number; to: number; count: number }
  previous: PageLink | null
  next: PageLink | null
  items: NumberedPageLink[] | null
}
