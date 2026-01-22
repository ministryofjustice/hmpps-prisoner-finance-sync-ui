import { addDays, subDays } from 'date-fns'
import { convertToTitleCase, initialiseName, parseDate, formatDate } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('parseDate', () => {
  it.each([
    ['2022-02-17', undefined, new Date(2022, 1, 17)],
    ['17/02/2022', 'dd/MM/yyyy', new Date(2022, 1, 17)],
  ])('%s parseDate(%s, %s)', (date: string, fmt: string, expected: Date) => {
    expect(parseDate(date, fmt)).toEqual(expected)
  })
})

describe('formatDate', () => {
  it('formats a date to a long date with day', () => {
    expect(formatDate(new Date(2022, 0, 1), 'cccc do LLLL y')).toEqual('Saturday 1st January 2022')
  })

  it('formats a date to a long date with day when inContext not available', () => {
    expect(formatDate(new Date(2022, 0, 1), 'cccc do LLLL y', true)).toEqual('Saturday 1st January 2022')
  })

  it('formats todays date as "today"', () => {
    expect(formatDate(new Date(), '', true)).toEqual('today')
  })

  it('formats yesterdays date as "yesterday"', () => {
    expect(formatDate(subDays(new Date(), 1), '', true)).toEqual('yesterday')
  })

  it('formats tomorrows date as "tomorrow"', () => {
    expect(formatDate(addDays(new Date(), 1), '', true)).toEqual('tomorrow')
  })

  it('formats a date in string format', () => {
    expect(formatDate('2022-01-01', 'cccc do LLLL y')).toEqual('Saturday 1st January 2022')
  })
})
