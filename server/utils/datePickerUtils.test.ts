import { parse } from 'date-fns'
import { formatDatePickerDate, isoDateToDatePickerDate } from './datePickerUtils'

describe('Date Picker Utils', () => {
  describe('isoDateToDatePickerDate', () => {
    it('returns undefined for non date string', () => {
      expect(isoDateToDatePickerDate('Not a date')).toBeNull()
    })

    it('converts iso date string to date picker date', () => {
      expect(isoDateToDatePickerDate('2023-03-02')).toEqual('02/03/2023')
    })
  })

  describe('formatDatePickerDate', () => {
    it('formats date as date picker date string', () => {
      expect(formatDatePickerDate(parse('2023-09-29', 'yyyy-MM-dd', new Date()))).toEqual('29/09/2023')
    })
  })
})
