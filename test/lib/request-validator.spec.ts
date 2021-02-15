import { validateRequest } from '../../lib/request-validator'

describe('validate request', () => {
  const content = 'content'
  const title = 'title'
  const author = 'author'
  const req = JSON.stringify({ content, title, author })

  describe('when valid', () => {
    it('returns the content', () => {
      const result = validateRequest(req)

      expect(result).toEqual({ success: true, content, title, author })
    })
  })

  describe('when invalid', () => {
    it('has the correct status code', () => {
      const result = validateRequest(JSON.stringify({ title: 'foo' }))

      expect(result).toEqual({ success: false, status: 400, message: 'Missing required params' })
    })
  })
})

