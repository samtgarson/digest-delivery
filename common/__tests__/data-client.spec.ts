import { SupabaseClient } from '@supabase/supabase-js'
import { ApiKey } from 'src/lib/api-key'
import type { Article } from 'types/digest'
import { DataClient } from '../data-client'

const from = jest.fn()
const insert = jest.fn()
const select = jest.fn()
const update = jest.fn()
const destroy = jest.fn()
const inFilter = jest.fn()
const eqFilter = jest.fn()
const neqFilter = jest.fn()
const single = jest.fn()
const isFilter = jest.fn()
const rangeFilter = jest.fn()

let mockSupabase: SupabaseClient

describe('data client', () => {
  let sut: DataClient
  const userId = 'user id'
  const title = 'i am a title'
  const content = 'i am a content'
  const author = 'i am a author'

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase = {
      from: from.mockReturnThis(),
      select: select.mockReturnThis(),
      update: update.mockReturnThis(),
      insert: insert.mockReturnThis(),
      delete: destroy.mockReturnThis(),
      in: inFilter.mockReturnThis(),
      eq: eqFilter.mockReturnThis(),
      is: isFilter.mockReturnThis(),
      neq: neqFilter,
      range: rangeFilter,
      single
    } as unknown as SupabaseClient

    sut = new DataClient(mockSupabase)
  })

  it('proxies the auth object', () => {
    expect(sut.auth).toEqual(mockSupabase.auth)
  })

  describe('createArticle', () => {
    it('creates the resource', async () => {
      await sut.createArticle(userId, { title, content, author })

      expect(from).toHaveBeenCalledWith('articles')
      expect(insert).toHaveBeenCalledWith({ title, content, author, user_id: userId }, { returning: 'minimal' })
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        insert.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createArticle(userId, { title, content, author })).rejects.toEqual(error)
      })
    })
  })

  describe('getUnprocessedArticles', () => {
    const articles = ['foo']
    const userId = 'user id'

    beforeEach(() => {
      isFilter.mockResolvedValue({ data: articles })
    })

    it('fetches the unprocessed articles', async () => {
      await sut.getUnprocessedArticles(userId)

      expect(from).toHaveBeenCalledWith('articles')
      expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
      expect(isFilter).toHaveBeenCalledWith('digest_id', null)
      expect(select).toHaveBeenCalledWith('*')
    })

    it('returns the articles', async () => {
      const result = await sut.getUnprocessedArticles(userId)

      expect(result).toEqual(articles)
    })

    describe('when it fails', () => {
      const error = new Error('foo')

      beforeEach(() => {
        isFilter.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.getUnprocessedArticles(userId)).rejects.toEqual(error)
      })
    })

  })

  describe('createDigest', () => {
    const articles = [{ id: 'id1' }, { id: 'id2' }] as Article[]
    const digestId = 'digest id'
    const userId = 'user id'
    const digest = { id: digestId }

    beforeEach(() => {
      single.mockResolvedValue({ data: digest })
    })

    it('creates the digest', async () => {
      await sut.createDigest(userId, articles)

      expect(from).toHaveBeenCalledWith('digests')
      expect(insert).toHaveBeenCalledWith({ user_id: userId })
      expect(single).toHaveBeenCalled()
    })

    it('updates the articles', async () => {
      await sut.createDigest(userId, articles)

      expect(from).toHaveBeenCalledWith('articles')
      expect(update).toHaveBeenCalledWith({ digest_id: digestId })
      expect(inFilter).toHaveBeenCalledWith('id', ['id1', 'id2'])
    })

    it('returns the digest', async () => {
      const result = await sut.createDigest(userId, articles)

      expect(result).toEqual(digest)
    })

    describe('when it fails to create the digest', () => {
      const error = new Error('foo')
      beforeEach(() => {
        single.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createDigest(userId, articles)).rejects.toEqual(error)
      })
    })

    describe('when it fails to update the articles', () => {
      const error = new Error('foo')
      beforeEach(() => {
        inFilter.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createDigest(userId, articles)).rejects.toEqual(error)
      })
    })
  })

  describe('getUser', () => {
    const id = 'id'
    const user = {}

    it('fetches the user', async () => {
      single.mockResolvedValue({ data: user })
      const result = await sut.getUser(id)

      expect(from).toHaveBeenCalledWith('users')
      expect(select).toHaveBeenCalledWith('*')
      expect(eqFilter).toHaveBeenCalledWith('id', id)
      expect(single).toHaveBeenCalled()

      expect(result).toEqual(user)
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        single.mockResolvedValue({ error })

        return expect(() => sut.getUser(id)).rejects.toEqual(error)
      })
    })
  })

  describe('updateUser', () => {
    const id = 'id'
    const user = {}
    const payload = { active: true }

    it('fetches the user', async () => {
      single.mockResolvedValue({ data: user })
      await sut.updateUser(id, payload)

      expect(from).toHaveBeenCalledWith('users')
      expect(update).toHaveBeenCalledWith(payload, { returning: 'minimal' })
      expect(eqFilter).toHaveBeenCalledWith('id', id)
      expect(single).toHaveBeenCalled()
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        single.mockResolvedValue({ error })

        return expect(() => sut.updateUser(id, payload)).rejects.toEqual(error)
      })
    })
  })

  describe('createApiKey', () => {
    const userId = 'user id'
    const encrypted = 'encrypted'
    const key = { userId, encrypted: () => encrypted } as ApiKey
    const id = 'id'
    const error = new Error('foo')

    beforeEach(async () => {
      single.mockResolvedValue({ data: { id } })
      neqFilter.mockResolvedValue({})
      await sut.createApiKey(key)
    })

    it('creates a new api key', () => {
      expect(from).toHaveBeenCalledWith('api_keys')
      expect(insert).toHaveBeenCalledWith({
        user_id: userId,
        key: encrypted
      })
      expect(single).toHaveBeenCalled()
    })

    it('expires the other api keys', () => {
      expect(from).toHaveBeenCalledWith('api_keys')
      expect(update).toHaveBeenCalledWith({ expired_at: expect.any(String) }, { returning: 'minimal' })
      expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
      expect(neqFilter).toHaveBeenCalledWith('id', id)
    })

    describe('when the creation raises an error', () => {
      beforeEach(() => {
        single.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createApiKey(key)).rejects.toEqual(error)
      })
    })

    describe('when the expiration raises an error', () => {
      beforeEach(() => {
        neqFilter.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createApiKey(key)).rejects.toEqual(error)
      })
    })
  })

  describe('validateApiKey', () => {
    const key = 'key'
    const userId = 'user id'
    const data = { user_id: userId }

    it('fetches the user', async () => {
      single.mockResolvedValue({ data })
      const result = await sut.validateApiKey(key)

      expect(from).toHaveBeenCalledWith('api_keys')
      expect(select).toHaveBeenCalledWith('user_id')
      expect(eqFilter).toHaveBeenCalledWith('key', key)
      expect(isFilter).toHaveBeenCalledWith('expired_at', null)
      expect(single).toHaveBeenCalled()

      expect(result).toEqual(userId)
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', async () => {
        single.mockResolvedValue({ error })

        const result = await sut.validateApiKey(key)
        expect(result).toBeUndefined()
      })
    })
  })

  describe('getDueUsers', () => {
    const users = [{ id: 'foo', kindle_address: 'bar' }]

    it('fetches due users', async () => {
      select.mockResolvedValue({ data: users })
      const result = await sut.getDueUsers()

      expect(from).toHaveBeenCalledWith('due_users')
      expect(select).toHaveBeenCalledWith('id,kindle_address')

      expect(result).toEqual(users)
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        select.mockResolvedValue({ error })

        return expect(() => sut.getDueUsers()).rejects.toEqual(error)
      })
    })
  })

  describe('getDigests', () => {
    const digests = [{ id: 'foo' }]
    const userId = 'user id'
    const total = 10

    it('fetches digests', async () => {
      rangeFilter.mockResolvedValue({ data: digests, count: total })
      const result = await sut.getDigests(userId)

      expect(from).toHaveBeenCalledWith('digests_with_meta')
      expect(select).toHaveBeenCalledWith('*', { count: 'estimated' })
      expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
      expect(rangeFilter).toHaveBeenCalledWith(0, 10)

      expect(result).toEqual({ data: digests, total })
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        rangeFilter.mockResolvedValue({ error })

        return expect(() => sut.getDigests(userId)).rejects.toEqual(error)
      })
    })

    describe('with pagination options supplied', () => {
      it('calculates the range', async () => {
        rangeFilter.mockResolvedValue({ data: digests, count: total })
        await sut.getDigests(userId, { perPage: 20, page: 3 })

        expect(rangeFilter).toHaveBeenCalledWith(60, 80)
      })
    })
  })

  describe('getDigest', () => {
    const digest = { id: 'foo', kindle_address: 'bar' }
    const userId = 'user id'
    const id = 'digest id'

    it('fetches digest with articles', async () => {
      single.mockResolvedValue({ data: digest })
      const result = await sut.getDigest(userId, id)

      expect(from).toHaveBeenCalledWith('digests')
      expect(select).toHaveBeenCalledWith('*, articles(*)')
      expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
      expect(eqFilter).toHaveBeenCalledWith('id', id)
      expect(single).toHaveBeenCalled()

      expect(result).toEqual(digest)
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        single.mockResolvedValue({ error })

        return expect(() => sut.getDigest(userId, id)).rejects.toEqual(error)
      })
    })
  })
})
