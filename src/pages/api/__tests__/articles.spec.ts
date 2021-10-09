import * as DataClient from 'common/data-client'
import * as MockDataClient from 'common/__mocks__/data-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { protectWithApiKey } from 'src/lib/api-authenticator'
import { validateArticlesRequest } from 'src/lib/request-validator'
import { mocked } from 'ts-jest/utils'
import handler from '../articles'

jest.mock('src/lib/request-validator')
jest.mock('common/data-client')
jest.mock('src/lib/api-authenticator', () => ({ protectWithApiKey: jest.fn(() => ({ id: 'user id' })) }))

const mockValidator = mocked(validateArticlesRequest)
const { createArticleMock } =  DataClient as unknown as typeof MockDataClient

describe('index', () => {
  const content = 'body'
  const title = 'title'
  const author = 'author'
  const originalUrl = 'url'
  const source = 'source'
  const attrs = { content, title, author, originalUrl, source }
  const req = { headers: { Authorization: 'api key' } } as unknown as NextApiRequest
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn()
  } as unknown as NextApiResponse

  beforeEach(() => {
    jest.clearAllMocks()
    mockValidator.mockReturnValue({ success: true, article: attrs })
  })

  it('succeeds', async () => {
    await handler(req, res)

    expect(createArticleMock).toHaveBeenCalledWith('user id', attrs)
    expect(res.status).toHaveBeenCalledWith(204)
  })

  describe('when db fails', () => {
    beforeEach(() => {
      createArticleMock.mockRejectedValue('oh no')
    })

    it('fails', async () => {
      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('when invalid params', () => {
    const message = 'message'

    beforeEach(() => {
      mockValidator.mockReturnValue({ success: false, status: 400, message })
    })

    it('fails', async () => {
      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: message })
    })
  })

  describe('when unauthenticated', () => {
    beforeEach(() => {
      mocked(protectWithApiKey).mockResolvedValue(null)
    })

    it('fails', async () => {
      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

