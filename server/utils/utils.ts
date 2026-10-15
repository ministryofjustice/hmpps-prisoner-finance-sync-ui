import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0]!.toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str?: string | null): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence?: string | null): string =>
  isBlank(sentence) ? '' : sentence!.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string | null): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0]?.[0]}. ${array.reverse()[0]}`
}

export const parseDate = (date: string, fromFormat = 'yyyy-MM-dd') => {
  if (!date) return null
  return parse(date, fromFormat, new Date())
}

export const formatDate = (date: unknown, fmt = 'EEEE, HH:mm - d MMMM yyyy', inContextName = false) => {
  if (!date) return null

  let richDate: Date

  if (date instanceof Date) {
    richDate = date
  } else if (typeof date === 'string') {
    // Native Date handles full ISO-8601 strings: '2026-10-06T10:59:34.119937Z'
    richDate = new Date(date)

    // Fallback: if native parsing fails, try parse() with a custom format
    if (Number.isNaN(richDate.getTime())) {
      richDate = parse(date, 'yyyy-MM-dd', new Date())
    }
  } else {
    richDate = new Date(date as number)
  }

  // Prevent RangeError: Invalid time value
  if (Number.isNaN(richDate.getTime())) {
    return null
  }

  if (inContextName) {
    if (isToday(richDate)) return 'today'
    if (isTomorrow(richDate)) return 'tomorrow'
    if (isYesterday(richDate)) return 'yesterday'
  }

  return format(richDate, fmt)
}

export const formatTransactionType = (requestTypeIdentifier: string): string => {
  switch (requestTypeIdentifier) {
    case 'SyncOffenderTransactionRequest': {
      return 'Offender'
    }
    case 'SyncGeneralLedgerTransactionRequest': {
      return 'General Ledger'
    }
    default: {
      return 'Unknown'
    }
  }
}

export const penceToPound = (pence: number): string => {
  if (pence === null || Number.isNaN(pence)) {
    return 'NaN'
  }

  const sign = pence < 0 ? '-' : ''
  const abs = Math.abs(pence)

  const pounds = Math.floor(abs / 100)
  const remainder = abs % 100

  const pennies = remainder.toString().padStart(2, '0')

  return `${sign}${pounds}.${pennies}`
}
