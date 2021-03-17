import { dateString, humaniseDate, relativeDate } from "common/util"
import { addDays, startOfDay } from "date-fns"

describe('utils', () => {
  describe('relativeDate', () => {
    it('handles near dates', () => {
      const date = addDays(startOfDay(new Date()), 1)

      expect(relativeDate(date)).toEqual('tomorrow')
    })

    it('handles far dates', () => {
      const date = new Date('2050-03-01T12:00:00Z')

      expect(relativeDate(date)).toEqual('1 Mar 2050')
    })

    it('handles strings', () => {
      expect(relativeDate('2050-03-01T12:00:00Z')).toEqual('1 Mar 2050')
    })
  })

  describe('humaniseDate', () => {
    [
      '2021-03-01T12:00:00Z',
      new Date('2021-03-01T12:00:00Z')
    ].forEach(date => {
      it(`humanises a ${typeof date}`, () => {
        expect(humaniseDate(date)).toEqual('1 Mar 2021')
      })
    })
  })

  describe('dateString', () => {
    [
      '2021-03-01T12:00:00Z',
      new Date('2021-03-01T12:00:00Z')
    ].forEach(date => {
      it(`formats a ${typeof date}`, () => {
        expect(dateString(date)).toEqual('2021-03-01')
      })
    })
  })
})
