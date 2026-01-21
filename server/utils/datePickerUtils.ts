import { isValid, parseISO } from 'date-fns'
import { formatDate } from './utils'

export const parseIsoDate = (isoDate: string): Date => {
  if (!isoDate) return null
  const date = parseISO(isoDate)
  if (!isValid(date)) return new Date(NaN)

  return date
}

export const formatDatePickerDate = (date: Date): string => {
  if (!isValid(date)) return null

  return formatDate(date, 'dd/MM/yyyy')
}

export const isoDateToDatePickerDate = (isoDate: string): string => {
  const date = parseIsoDate(isoDate)
  return formatDatePickerDate(date)
}
