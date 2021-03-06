import { createHash } from "crypto"
import { ApiKey } from "../api-key"

describe('API Key', () => {
  let key: ApiKey

  beforeEach(() => {
    key = new ApiKey()
  })

  describe('new api key', () => {
    it('assigns a UUID', () => {
      expect(key.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('can be encrypted', () => {
      const hash = createHash('sha256').update(key.id).digest('hex')
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
