/* eslint-disable promise/prefer-await-to-callbacks */
import type { S3 } from "aws-sdk"
import type { createReadStream } from "fs"
import { mocked } from "ts-jest/utils"
import { CoverUploader } from "../cover-uploader"

describe('Cover uploader', () => {
  let sut: CoverUploader
  const bucketName = 'bucket name'
  const filename = 'file name'
  const path = 'path'

  const s3Client = { upload: jest.fn().mockReturnThis(), promise: jest.fn() } as unknown as S3
  const mockStream = { on: jest.fn() }
  const createStream = jest.fn(() => mockStream) as unknown as typeof createReadStream
  const basename = jest.fn(() => filename)

  beforeEach(async () => {
    sut = new CoverUploader(s3Client, bucketName, createStream, basename)
  })

  it('creates a stream', async () => {
    await sut.upload(path)
    expect(createStream).toHaveBeenCalledWith(path)
  })

  it('uploads the file', async () => {
    await sut.upload(path)
    expect(s3Client.upload).toHaveBeenCalledWith({
      Bucket: bucketName,
      Key: filename,
      Body: mockStream,
      ContentType: 'image/png',
      CacheControl: 'max-age=31536000, immutable'
    })
  })

  it('throws a stream error', async () => {
    const err = new Error('oh no')

    mocked(mockStream.on).mockImplementation((evt, cb) => {
      expect(evt).toEqual('error')
      cb(err)
    })

    return expect(() => sut.upload(path)).rejects.toEqual(err)
  })
})
