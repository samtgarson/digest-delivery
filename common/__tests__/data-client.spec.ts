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

let mockSupabase: SupabaseClient

describe('data client', () => {
  let sut: DataClient
  const userId = 'user id'
  const title = 'i am a title'
  const content = 'i am a content'
  const author = 'i am a author'

  beforeEach(() => {
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
      single
    } as unknown as SupabaseClient

    sut = new DataClient(mockSupabase)
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

  describe('destroyProcessedArticles', () => {
    const articles = [{ id: 'id1' }, { id: 'id2' }] as Article[]

    beforeEach(() => {
      inFilter.mockResolvedValue({})
    })

    it('destroys the articles', async () => {
      await sut.destroyProcessedArticles(articles)

      expect(from).toHaveBeenCalledWith('articles')
      expect(destroy).toHaveBeenCalled()
      expect(inFilter).toHaveBeenCalledWith('id', ['id1', 'id2'])
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        inFilter.mockResolvedValue({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.destroyProcessedArticles(articles)).rejects.toEqual(error)
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
      expect(update).toHaveBeenCalledWith({ expired_at: expect.any(Date) }, { returning: 'minimal' })
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
    const users = [{ id: 'foo' }]

    it('fetches due users', async () => {
      select.mockResolvedValue({ data: users })
      const result = await sut.getDueUsers()

      expect(from).toHaveBeenCalledWith('due_users')
      expect(select).toHaveBeenCalledWith('id')

      expect(result).toEqual(users.map(u => u.id))
    })

    describe('when there is an error', () => {
      const error = new Error('foo')

      it('throws the error', () => {
        select.mockResolvedValue({ error })

        return expect(() => sut.getDueUsers()).rejects.toEqual(error)
      })
    })
  })
})
