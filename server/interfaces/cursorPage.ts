export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  totalElements: number
  size: number
}
