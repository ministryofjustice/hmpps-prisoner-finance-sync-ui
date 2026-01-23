import { isValid, parseISO, startOfToday, parse } from 'date-fns'
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

export const formatIsoDate = (date: Date): string => {
  if (!isValid(date)) return null

  return formatDate(date, 'yyyy-MM-dd')
}

export const parseDatePickerStringToIsoString = (datePickerDate: string): string => {
  if (!datePickerDate) return null

  const dateFormatPattern = /(\d{1,2})([-/,. ])(\d{1,2})[-/,. ](\d{2,4})/

  if (!dateFormatPattern.test(datePickerDate)) return '2001-01-01'

  const dateMatches = datePickerDate.match(dateFormatPattern)

  const separator = dateMatches[2]
  const year = dateMatches[4]

  const date = parse(datePickerDate, `dd${separator}MM${separator}${'y'.repeat(year.length)}`, startOfToday())

  return formatDate(date, 'yyyy-MM-dd')
}
