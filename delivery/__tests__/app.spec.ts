import { DataClient } from 'common/data-client'
import { CoverGenerator } from 'delivery/lib/cover-generator'
import { CoverUploader } from 'delivery/lib/cover-uploader'
import { mockDeep } from 'jest-mock-extended'
import { User } from 'types/digest'
import { DeliveryWorker } from 'types/worker'
import { handler } from '../app'

const worker = jest.fn() as unknown as DeliveryWorker

const dataClient = mockDeep<DataClient>()
const coverGenerator = mockDeep<CoverGenerator>()
const coverUploader = mockDeep<CoverUploader>()
const dependencies = { dataClient, coverGenerator, coverUploader }

describe('delivery worker', () => {
  const users = [{ id: '123' }, { id: '456' }] as User[]
  const coverPath = '/Users/sam/Documents/Profile 2.png'

  beforeEach(async () => {
    jest.clearAllMocks()
    dataClient.getDueUsers.mockResolvedValue(users)
  })

  describe('with due users found', () => {
    beforeEach(async () => {
      dataClient.getDueUsers.mockResolvedValue(users)
      coverGenerator.generate.mockResolvedValue(coverPath)
      await handler(worker, dependencies)
    })

    it('fetches the due users', () => {
      expect(dataClient.getDueUsers).toHaveBeenCalled()
    })

    it('generates a cover', () => {
      expect(coverGenerator.generate).toHaveBeenCalledWith(expect.any(Date))
    })

    it('uploads the cover', () => {
      expect(coverUploader.upload).toHaveBeenCalledWith(coverPath)
    })

    it('delivers a digest for each user', () => {
      expect(worker).toHaveBeenCalledTimes(2)
      expect(worker).toHaveBeenNthCalledWith(1, users[0], coverPath)
      expect(worker).toHaveBeenNthCalledWith(2, users[1], coverPath)
    })
  })

  describe('with no due users found', () => {
    beforeEach(async () => {
      dataClient.getDueUsers.mockResolvedValue([])
      await handler(worker, dependencies)
    })

    it('does not proceed', () => {
      expect(coverGenerator.generate).not.toHaveBeenCalled()
      expect(worker).not.toHaveBeenCalled()
    })
  })
})
