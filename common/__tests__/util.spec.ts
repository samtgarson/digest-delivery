import { DataClient } from "@digest-delivery/common/data-client"
import { dateString, dehydrate, humaniseDate, hydrate, relativeDate } from "@digest-delivery/common/util"
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

  describe('hydrate', () => {
    const complex = new DataClient()

    const cases = {
      null: [null, null],
      strings: ['1234', '1234'],
      arrays: [['1234', { a: [1, 2] }], ['1234', { a: [1, 2] }]],
      objects_with_dates: [
        { a: complex, b: '2021-01-01T12:00:00' },
        { a: complex, b: new Date('2021-01-01T12:00:00' ) }
      ]
    }

    Object.entries(cases).forEach(([type, [input, expected]]) => {
      it(`hydrates ${type}`, () => {
        const result = hydrate(input)
        expect(result).toEqual(expected)
      })
    })
  })

  describe('dehydrate', () => {
    const dateStr = '2021-03-01T13:00:00-01:00'

    it ('dehydrates with timezones', () => {
      const input = {
        a: 'foo',
        b: 123,
        c: new Date(dateStr)
      }

      expect(dehydrate(input)).toEqual(JSON.stringify({
        ...input,
        c: '2021-03-01T14:00:00.000Z'
      }))
    })
  })
})
