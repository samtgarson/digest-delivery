import { DataClient } from '@digest-delivery/common/data-client'
import { addDays, isSameDay } from 'date-fns'
import { mockDeep } from 'jest-mock-extended'
import { DigestEntityWithMeta, User } from 'types/digest'
import { DeliveryDateCalculator } from '../delivery-date-calculator'
import { Frequency } from '../util/frequency'

const dataClient = mockDeep<DataClient>()
dataClient.getDigests.mockResolvedValue({ total: 0, data: [] })

describe('Delivery date calculator', () => {
  let sut: DeliveryDateCalculator
  const userId = 'user id'
  let result: Date

  beforeEach(async () => {
    jest.clearAllMocks()
    sut = new DeliveryDateCalculator(dataClient)
    result = await sut.calculate(userId)
  })

  it('fetches the most recent digest', () => {
    expect(dataClient.getDigests).toHaveBeenCalledWith(userId, { perPage: 1 })
  })

  it('fetches the user object', () => {
    expect(dataClient.getUser).toHaveBeenCalledWith(userId)
  })

  it('returns today', () => {
    const expected = new Date()
    expect(isSameDay(result, expected)).toBeTruthy()
  })

  describe('when there is a previous delivery', () => {
    const deliveredAt = addDays(new Date(), -1)

    beforeEach(async () => {
      dataClient.getDigests.mockResolvedValueOnce({
        total: 1,
        data: [{ deliveredAt } as DigestEntityWithMeta]
      })
      result = await sut.calculate(userId)
    })

    it('returns today', () => {
      const expected = new Date()
      expect(isSameDay(result, expected)).toBeTruthy()
    })

    describe('but its much older', () => {
      const deliveredAt = addDays(new Date(), -3)

      beforeEach(async () => {
        dataClient.getDigests.mockResolvedValueOnce({
          total: 1,
          data: [{ deliveredAt } as DigestEntityWithMeta]
        })
        result = await sut.calculate(userId)
      })

      it('returns tomorrow', () => {
        const expected = addDays(new Date(), 1)
        expect(isSameDay(result, expected)).toBeTruthy()
      })
    })
  })

  describe('when the user has chosen weekly', () => {
    const deliveredAt = addDays(new Date(), -3)

    beforeEach(async () => {
      dataClient.getDigests.mockResolvedValueOnce({
        total: 1,
        data: [{ deliveredAt } as DigestEntityWithMeta]
      })
      dataClient.getUser.mockResolvedValue({
        frequency: Frequency.Weekly
      } as User)
      result = await sut.calculate(userId)
    })

    it('returns a week after the last delivery date', () => {
      const expected = addDays(new Date(), 4)
      expect(isSameDay(result, expected)).toBeTruthy()
    })
  })
})
