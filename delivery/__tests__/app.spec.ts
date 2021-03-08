import { handler } from '../app'
import * as DataClient from 'common/data-client'
import * as MockDataClient from 'common/__mocks__/data-client'
import * as CoverGenerator from '../lib/cover-generator'
import * as MockCoverGenerator from '../lib/__mocks__/cover-generator'
import { humaniseDate } from '../lib/util'
import { DeliveryWorker } from 'types/worker'
import { mocked } from 'ts-jest/utils'

jest.mock('../../common/data-client')
jest.mock('../lib/mailer')
jest.mock('../lib/article-compiler')
jest.mock('../lib/cover-generator')
jest.mock('../lib/util')

const mockHumaniseDate = mocked(humaniseDate)
const { getDueUsersMock } = DataClient as unknown as typeof MockDataClient
const { generateMock } = CoverGenerator as unknown as typeof MockCoverGenerator
const worker = jest.fn() as unknown as DeliveryWorker

describe('queue', () => {
  const userIds = ['123', '456']
  const coverPath = 'cover path'
  const humanDate = 'human date'

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('with due users found', () => {
    beforeEach(async () => {
      getDueUsersMock.mockResolvedValue(userIds)
      generateMock.mockResolvedValue(coverPath)
      mockHumaniseDate.mockReturnValue(humanDate)
      await handler(worker)
    })

    it('fetches the due users', () => {
      expect(getDueUsersMock).toHaveBeenCalled()
    })

    it('generates a cover', () => {
      expect(mockHumaniseDate).toHaveBeenCalledWith(expect.any(Date))
      expect(generateMock).toHaveBeenCalledWith(humanDate)
    })

    it('delivers a digest for each user', () => {
      expect(worker).toHaveBeenCalledTimes(2)
      expect(worker).toHaveBeenNthCalledWith(1, userIds[0], coverPath)
      expect(worker).toHaveBeenNthCalledWith(2, userIds[1], coverPath)
    })
  })

  describe('with no due users found', () => {
    beforeEach(async () => {
      getDueUsersMock.mockResolvedValue([])
      await handler(worker)
    })

    it('does not proceed', () => {
      expect(generateMock).not.toHaveBeenCalled()
      expect(worker).not.toHaveBeenCalled()
    })
  })
})
