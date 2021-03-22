import { DataClient } from "common/data-client"
import { addDays, isSameDay } from "date-fns"
import { DigestEntityWithMeta, Frequency } from "types/digest"
import { DeliveryDateCalculator } from "../delivery-date-calculator"

const getDigests = jest.fn<ReturnType<DataClient['getDigests']>, [string]>(async () => ({ total: 0, data: [] }))
const getUser = jest.fn()
const dataClient = { getDigests, getUser } as unknown as DataClient

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
    expect(getDigests).toHaveBeenCalledWith(userId, { perPage: 1 })
  })

  it('fetches the user object', () => {
    expect(getUser).toHaveBeenCalledWith(userId)
  })

  it('returns today', () => {
    const expected = new Date()
    expect(isSameDay(result, expected)).toBeTruthy()
  })

  describe('when there is a previous delivery', () => {
    const delivered_at = addDays(new Date(), -1)

    beforeEach(async () => {
      getDigests.mockResolvedValueOnce({ total: 1, data: [{ delivered_at } as DigestEntityWithMeta] })
      result = await sut.calculate(userId)
    })

    it('returns today', () => {
      const expected = new Date()
      expect(isSameDay(result, expected)).toBeTruthy()
    })

    describe('but its much older', () => {
      const delivered_at = addDays(new Date(), -3)

      beforeEach(async () => {
        getDigests.mockResolvedValueOnce({ total: 1, data: [{ delivered_at } as DigestEntityWithMeta] })
        result = await sut.calculate(userId)
      })

      it('returns tomorrow', () => {
        const expected = addDays(new Date(), 1)
        expect(isSameDay(result, expected)).toBeTruthy()
      })
    })
  })

  describe('when the user has chosen weekly', () => {
    const delivered_at = addDays(new Date(), -3)

    beforeEach(async () => {
      getDigests.mockResolvedValueOnce({ total: 1, data: [{ delivered_at } as DigestEntityWithMeta] })
      getUser.mockResolvedValue({ frequency: Frequency.Weekly })
      result = await sut.calculate(userId)
    })

    it('returns a week after the last delivery date', () => {
      const expected = addDays(new Date(), 4)
      expect(isSameDay(result, expected)).toBeTruthy()
    })
  })
})
