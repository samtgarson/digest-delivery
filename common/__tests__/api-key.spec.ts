import { createHash } from 'crypto'
import { ApiKey } from '../api-key'

describe('API Key', () => {
  let key: ApiKey

  beforeEach(() => {
    key = new ApiKey('userId')
  })

  describe('new api key', () => {
    it('assigns a UUID', () => {
      expect(key.key).toMatch(/^([0-9A-Z]{7}-){3}[0-9A-Z]{7}$/)
    })

    it('can be encrypted', () => {
      const hash = createHash('sha256').update(key.key).digest('hex')
      expect(key.encrypted()).toEqual(hash)
    })
  })

  describe('compare', () => {
    it('compares a key with a hash', () => {
      const hash = createHash('sha256').update('1234').digest('hex')

      expect(ApiKey.encrypt('1234')).toEqual(hash)
    })
  })
})
