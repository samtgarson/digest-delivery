import { handler } from '../articles'
import { validateRequest } from '../../../lib/request-validator'
import { mocked } from 'ts-jest/utils'
import * as DataClient from '@digest-delivery/common/data-client'
import * as MockDataClient from '@digest-delivery/common/__mocks__/data-client'
import type { NextApiRequest, NextApiResponse } from 'next'

jest.mock('../../../lib/request-validator')
jest.mock('@digest-delivery/common/data-client')

const mockValidator = mocked(validateRequest)
const { createArticleMock } =  DataClient as unknown as typeof MockDataClient

describe('index', () => {
  const content = 'body'
  const title = 'title'
  const author = 'author'
  const req = {} as NextApiRequest
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn()
  } as unknown as NextApiResponse

  beforeEach(() => {
    mockValidator.mockReturnValue({ success: true, content, title, author })
  })

  it('succeeds', async () => {
    await handler(req, res)

    expect(createArticleMock).toHaveBeenCalledWith(title, content, author)
    expect(res.status).toHaveBeenCalledWith(201)
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

