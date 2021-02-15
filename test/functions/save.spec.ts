import { handler } from '../../functions/save'
import { validateRequest } from '../../lib/request-validator'
import { mocked } from 'ts-jest/utils'
import * as DataClient from '../../lib/data-client'
import * as MockDataClient from '../../lib/__mocks__/data-client'
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'

jest.mock('../../lib/request-validator')
jest.mock('../../lib/data-client')

const mockValidator = mocked(validateRequest)
const { createArticleMock } =  DataClient as unknown as typeof MockDataClient

describe('index', () => {
  const content = 'body'
  const title = 'title'
  const author = 'author'
  const evt = {
    body: JSON.stringify({ title, content, author })
  } as APIGatewayProxyEventV2
  const ctx = {} as Context

  beforeEach(() => {
    mockValidator.mockReturnValue({ success: true, content, title, author })
  })

  it('succeeds', async () => {
    const res = await handler(evt, ctx, jest.fn()) as APIGatewayProxyStructuredResultV2

    expect(createArticleMock).toHaveBeenCalledWith(title, content, author)
    expect(res.statusCode).toEqual(201)
  })

  describe('when db fails', () => {
    beforeEach(() => {
      createArticleMock.mockRejectedValue('oh no')
    })

    it('fails', async () => {
      const res = await handler(evt, ctx, jest.fn()) as APIGatewayProxyStructuredResultV2

      expect(res.statusCode).toEqual(500)
    })
  })

  describe('when invalid params', () => {
    const message = 'message'

    beforeEach(() => {
      mockValidator.mockReturnValue({ success: false, status: 400, message })
    })

    it('fails', async () => {
      const res = await handler(evt, ctx, jest.fn()) as APIGatewayProxyStructuredResultV2

      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual(JSON.stringify({ error: message }))
    })
  })
})

