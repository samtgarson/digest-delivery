import { DataClient } from "common/data-client"
import { DigestEntityWithMeta, Frequency } from "types/digest"
import { DeliveryDateCalculator } from "../delivery-date-calculator"

const getDigests = jest.fn<ReturnType<DataClient['getDigests']>, [string]>(async () => ({ total: 0, data: [] }))
const getUser = jest.fn()
const dataClient = { getDigests, getUser } as unknown as DataClient

const addResult = new Date()
const add = jest.fn(() => addResult)

describe('Delivery date calculator', () => {
  let sut: DeliveryDateCalculator
  const userId = 'user id'
  const today = new Date()
  let result: Date

  beforeEach(async () => {
    jest.clearAllMocks()
    sut = new DeliveryDateCalculator(dataClient, today, add)
    result = await sut.calculate(userId)
  })

  it('fetches the most recent digest', () => {
    expect(getDigests).toHaveBeenCalledWith(userId, { perPage: 1 })
  })

  it('fetches the user object', () => {
    expect(getUser).toHaveBeenCalledWith(userId)
  })

  it('uses yesterday by default', () => {
    expect(add).toHaveBeenCalledWith(today, -1)
  })

  it('returns the added result', () => {
    expect(add).toHaveBeenCalledWith(addResult, 1)
    expect(result).toEqual(addResult)
  })

  describe('when there is a previous delivery', () => {
    const delivered_at = '2021-01-01T12:00:00Z'

    beforeEach(async () => {
      getDigests.mockResolvedValueOnce({ total: 1, data: [{ delivered_at } as DigestEntityWithMeta] })
      result = await sut.calculate(userId)
    })

    it('uses the last delivery date instead', () => {
      expect(add).toHaveBeenCalledWith(new Date(delivered_at), 1)
    })
  })

  describe('when the user has chosen weekly', () => {
    beforeEach(async () => {
      getUser.mockResolvedValue({ frequency: Frequency.Weekly })
      result = await sut.calculate(userId)
    })

    it('uses the last delivery date instead', () => {
      expect(add).toHaveBeenCalledWith(today, 7)
    })
  })
})
