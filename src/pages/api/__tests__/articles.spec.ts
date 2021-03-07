import handler from '../articles'
import { validateArticlesRequest } from '../../../lib/request-validator'
import { mocked } from 'ts-jest/utils'
import * as DataClient from '../../../../common/data-client'
import * as MockDataClient from '../../../../common/__mocks__/data-client'
import type { NextApiRequest, NextApiResponse } from 'next'

jest.mock('../../../lib/request-validator')
jest.mock('../../../../common/data-client')
jest.mock('src/lib/api-authenticator', () => ({ protectWithApiKey: () => ({ id: 'user id' }) }))

const mockValidator = mocked(validateArticlesRequest)
const { createArticleMock } =  DataClient as unknown as typeof MockDataClient

describe('index', () => {
  const content = 'body'
  const title = 'title'
  const author = 'author'
  const req = { headers: { Authorization: 'api key' } } as unknown as NextApiRequest
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn()
  } as unknown as NextApiResponse

  beforeEach(() => {
    mockValidator.mockReturnValue({ success: true, article: { content, title, author } })
  })

  it('succeeds', async () => {
    await handler(req, res)

    expect(createArticleMock).toHaveBeenCalledWith('user id', { title, content, author })
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
})

