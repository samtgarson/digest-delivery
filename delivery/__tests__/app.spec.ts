import { handler } from '../app'
import * as DataClient from 'common/data-client'
import * as MockDataClient from 'common/__mocks__/data-client'
import * as CoverGenerator from '../lib/cover-generator'
import * as MockCoverGenerator from '../lib/__mocks__/cover-generator'
import * as CoverUploader from '../lib/cover-uploader'
import * as MockCoverUploader from '../lib/__mocks__/cover-uploader'
import { DeliveryWorker } from 'types/worker'

jest.mock('../lib/mailer')
jest.mock('../lib/article-compiler')
jest.mock('../lib/cover-generator')
jest.mock('../lib/cover-uploader')
jest.mock('common/data-client')

const { getDueUsersMock } = DataClient as unknown as typeof MockDataClient
const { generateMock } = CoverGenerator as unknown as typeof MockCoverGenerator
const { uploadMock } = CoverUploader as unknown as typeof MockCoverUploader
const worker = jest.fn() as unknown as DeliveryWorker

describe('queue', () => {
  const userIds = ['123', '456']
  const coverPath = '/Users/sam/Documents/Profile 2.png'

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('with due users found', () => {
    beforeEach(async () => {
      getDueUsersMock.mockResolvedValue(userIds)
      generateMock.mockResolvedValue(coverPath)
      await handler(worker)
    })

    it('fetches the due users', () => {
      expect(getDueUsersMock).toHaveBeenCalled()
    })

    it('generates a cover', () => {
      expect(generateMock).toHaveBeenCalledWith(expect.any(Date))
    })

    it('uploads the cover', () => {
      expect(uploadMock).toHaveBeenCalledWith(coverPath)
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
