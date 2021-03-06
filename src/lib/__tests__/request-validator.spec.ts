import { NextApiRequest } from 'next'
import { validateArticlesRequest } from '../request-validator'

describe('validate request', () => {
  const content = 'content'
  const title = 'title'
  const author = 'author'
  const req = { body: { content, title, author } } as NextApiRequest

  describe('when valid', () => {
    it('returns the content', () => {
      const result = validateArticlesRequest(req)

      expect(result).toEqual({ success: true, content, title, author })
    })
  })

  describe('when invalid', () => {
    it('has the correct status code', () => {
      const result = validateArticlesRequest({ body: { title: 'foo' } } as NextApiRequest)

      expect(result).toEqual({ success: false, status: 400, message: 'Missing required params' })
    })
  })
})

