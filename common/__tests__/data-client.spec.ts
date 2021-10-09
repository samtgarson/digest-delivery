import { Article, Digest, PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { DataClient } from '../data-client'

const client = mockDeep<PrismaClient>()

describe('data client', () => {
  let sut: DataClient

  beforeEach(() => {
    mockReset(client)
    sut = new DataClient(client)
  })

//   it('proxies the auth object', () => {
//     expect(sut.auth).toEqual(mockSupabase.auth)
//   })

  describe('createArticle', () => {
    const userId = 'user id'
    const title = 'i am a title'
    const content = 'i am a content'
    const author = 'i am a author'
    const originalUrl = 'i am a original url'
    const source = 'i am a source'
    const attrs = { title, content, author, originalUrl, source }

    it('creates the resource', async () => {
      await sut.createArticle(userId, attrs)

      expect(client.article.create).toHaveBeenCalledWith({ data: { userId, ...attrs } })
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        client.article.create.mockRejectedValue(error)
      })

      it('throws the error', () => {
        return expect(() => sut.createArticle(userId, attrs)).rejects.toEqual(error)
      })
    })
  })

  describe('getArticles', () => {
    const articles = [{ id: 'id1' }, { id: 'id2' }] as Article[]
    const userId = 'user id'

    beforeEach(() => {
      client.article.findMany.mockResolvedValue(articles)
    })

    it('fetches the articles', async () => {
      await sut.getArticles(userId)

      expect(client.article.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: { userId: { equals: userId } }
      })
    })

    it('returns the articles', async () => {
      const result = await sut.getArticles(userId)

      expect(result).toEqual(articles)
    })

    describe('when it fails', () => {
      const error = new Error('foo')

      beforeEach(() => {
        client.article.findMany.mockRejectedValue(error)
      })

      it('throws the error', () => {
        return expect(() => sut.getArticles(userId)).rejects.toEqual(error)
      })
    })

    describe('when fetching unprocessed articles only', () => {
      it('fetches the articles', async () => {
        await sut.getArticles(userId, { unprocessed: true })

        expect(client.article.findMany).toHaveBeenCalledWith({
          orderBy: { createdAt: 'desc' },
          where: { userId: { equals: userId }, digestId: { equals: null } }
        })
      })
    })
  })

  describe('createDigest', () => {
    const articles = [{ id: 'id1' }, { id: 'id2' }] as Article[]
    const userId = 'user id'
    const digestId = 'digest id'
    const digest = { id: digestId } as Digest

    beforeEach(() => {
      client.digest.create.mockResolvedValue(digest)
    })

    it('creates the digest', async () => {
      await sut.createDigest(userId, articles)

      expect(client.digest.create).toHaveBeenCalledWith({
        data: { userId, articles: { connect: articles } }
      })
    })

    it('returns the digest', async () => {
      const result = await sut.createDigest(userId, articles)

      expect(result).toEqual(digest)
    })

    describe('when it fails to create the digest', () => {
      const error = new Error('foo')
      beforeEach(() => {
        client.digest.create.mockRejectedValue(error)
      })

      it('throws the error', () => {
        return expect(() => sut.createDigest(userId, articles)).rejects.toEqual(error)
      })
    })
  })

  describe('getUser', () => {
    // const id = 'id'
    // const user = {}

    it('fetches the user', async () => {
//       single.mockResolvedValue({ data: user })
//       const result = await sut.getUser(id)

//       expect(from).toHaveBeenCalledWith('users')
//       expect(select).toHaveBeenCalledWith('*')
//       expect(eqFilter).toHaveBeenCalledWith('id', id)
//       expect(single).toHaveBeenCalled()

//       expect(result).toEqual(user)
    })

    describe('when there is an error', () => {
//       const error = new Error('foo')

      it('throws the error', () => {
//         single.mockResolvedValue({ error })

//         return expect(() => sut.getUser(id)).rejects.toEqual(error)
      })
    })
  })

  describe('updateUser', () => {
//     const id = 'id'
//     const user = {}
//     const payload = { active: true }

    it('fetches the user', async () => {
//       single.mockResolvedValue({ data: user })
//       await sut.updateUser(id, payload)

//       expect(from).toHaveBeenCalledWith('users')
//       expect(update).toHaveBeenCalledWith(payload, { returning: 'minimal' })
//       expect(eqFilter).toHaveBeenCalledWith('id', id)
//       expect(single).toHaveBeenCalled()
    })

    describe('when there is an error', () => {
//       const error = new Error('foo')

      it('throws the error', () => {
//         single.mockResolvedValue({ error })

//         return expect(() => sut.updateUser(id, payload)).rejects.toEqual(error)
      })
    })
  })

  describe('createApiKey', () => {
//     const userId = 'user id'
//     const encrypted = 'encrypted'
//     const key = { userId, encrypted: () => encrypted } as ApiKey
//     const id = 'id'
//     const error = new Error('foo')

    beforeEach(async () => {
//       single.mockResolvedValue({ data: { id } })
//       neqFilter.mockResolvedValue({})
//       await sut.createApiKey(key)
    })

    it('creates a new api key', () => {
//       expect(from).toHaveBeenCalledWith('api_keys')
//       expect(insert).toHaveBeenCalledWith({
//         user_id: userId,
//         key: encrypted
//       })
//       expect(single).toHaveBeenCalled()
    })

    it('expires the other api keys', () => {
//       expect(from).toHaveBeenCalledWith('api_keys')
//       expect(update).toHaveBeenCalledWith({ expired_at: expect.any(Date) }, { returning: 'minimal' })
//       expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
//       expect(neqFilter).toHaveBeenCalledWith('id', id)
    })

    describe('when the creation raises an error', () => {
      beforeEach(() => {
//         single.mockResolvedValue({ error })
      })

      it('throws the error', () => {
//         return expect(() => sut.createApiKey(key)).rejects.toEqual(error)
      })
    })

    describe('when the expiration raises an error', () => {
      beforeEach(() => {
//         neqFilter.mockResolvedValue({ error })
      })

      it('throws the error', () => {
//         return expect(() => sut.createApiKey(key)).rejects.toEqual(error)
      })
    })
  })

  describe('validateApiKey', () => {
//     const key = 'key'
//     const userId = 'user id'
//     const data = { user_id: userId }

    it('fetches the user', async () => {
//       single.mockResolvedValue({ data })
//       const result = await sut.validateApiKey(key)

//       expect(from).toHaveBeenCalledWith('api_keys')
//       expect(select).toHaveBeenCalledWith('user_id')
//       expect(eqFilter).toHaveBeenCalledWith('key', key)
//       expect(isFilter).toHaveBeenCalledWith('expired_at', null)
//       expect(single).toHaveBeenCalled()

//       expect(result).toEqual(userId)
    })

    describe('when there is an error', () => {
//       const error = new Error('foo')

      it('throws the error', async () => {
//         single.mockResolvedValue({ error })

//         const result = await sut.validateApiKey(key)
//         expect(result).toBeUndefined()
      })
    })
  })

  describe('getDueUsers', () => {
//     const users = [{ id: 'foo', kindle_address: 'bar' }]

    it('fetches due users', async () => {
//       select.mockResolvedValue({ data: users })
//       const result = await sut.getDueUsers()

//       expect(from).toHaveBeenCalledWith('due_users')
//       expect(select).toHaveBeenCalledWith('id,kindle_address')

//       expect(result).toEqual(users)
    })

    describe('when there is an error', () => {
      // const error = new Error('foo')

      it('throws the error', () => {
//         select.mockResolvedValue({ error })

//         return expect(() => sut.getDueUsers()).rejects.toEqual(error)
      })
    })
  })

  describe('getDigests', () => {
//     const digests = [{ id: 'foo' }]
//     const userId = 'user id'
//     const total = 10

    it('fetches digests', async () => {
//       rangeFilter.mockResolvedValue({ data: digests, count: total })
//       const result = await sut.getDigests(userId)

//       expect(from).toHaveBeenCalledWith('digests_with_meta')
//       expect(select).toHaveBeenCalledWith('*', { count: 'estimated' })
//       expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
//       expect(order).toHaveBeenCalledWith('delivered_at')
//       expect(rangeFilter).toHaveBeenCalledWith(0, 10)

//       expect(result).toEqual({ data: digests, total })
    })

    describe('when there is an error', () => {
//       const error = new Error('foo')

      it('throws the error', () => {
//         rangeFilter.mockResolvedValue({ error })

//         return expect(() => sut.getDigests(userId)).rejects.toEqual(error)
      })
    })

    describe('with pagination options supplied', () => {
      it('calculates the range', async () => {
//         rangeFilter.mockResolvedValue({ data: digests, count: total })
//         await sut.getDigests(userId, { perPage: 20, page: 3 })

//         expect(rangeFilter).toHaveBeenCalledWith(60, 80)
      })
    })

    describe('when including articles', () => {
      it('returns the articles too', async () => {
//         await sut.getDigests(userId, { includeArticles: true })

//         expect(select).toHaveBeenCalledWith('*, articles(*)', { count: 'estimated' })
      })
    })
  })

  describe('getDigest', () => {
//     const digest = { id: 'foo', kindle_address: 'bar' }
//     const userId = 'user id'
//     const id = 'digest id'

    it('fetches digest with articles', async () => {
//       single.mockResolvedValue({ data: digest })
//       const result = await sut.getDigest(userId, id)

//       expect(from).toHaveBeenCalledWith('digests')
//       expect(select).toHaveBeenCalledWith('*, articles(*)')
//       expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
//       expect(eqFilter).toHaveBeenCalledWith('id', id)
//       expect(single).toHaveBeenCalled()

//       expect(result).toEqual(digest)
    })

    describe('when there is an error', () => {
//       const error = new Error('foo')

      it('throws the error', () => {
//         single.mockResolvedValue({ error })

//         return expect(() => sut.getDigest(userId, id)).rejects.toEqual(error)
      })
    })
  })

  describe('createSubscription', () => {
//     const userId = 'user id'
//     const hookUrl = 'hook url'
//     const subscription = { id: 'foo' }

    beforeEach(() => {
//       insert.mockResolvedValue({ data: [subscription] })
    })

    it('creates the resource', async () => {
//       await sut.createSubscription(userId, hookUrl)

//       expect(from).toHaveBeenCalledWith('subscriptions')
//       expect(insert).toHaveBeenCalledWith({ hook_url: hookUrl, user_id: userId })
    })

    it('returns the resource', async () => {
//       const result = await sut.createSubscription(userId, hookUrl)
//       expect(result).toEqual(subscription)
    })

    describe('when it fails', () => {
//       const error = new Error('foo')
      beforeEach(() => {
//         insert.mockResolvedValue({ error })
      })

      it('throws the error', () => {
//         return expect(() => sut.createSubscription(userId, hookUrl)).rejects.toEqual(error)
      })
    })
  })

  describe('deleteSubscription', () => {
//     const userId = 'user id'
//     const hookUrl = 'hook url'

    it('destroys the resource', async () => {
//       await sut.deleteSubscription(userId, hookUrl)

//       expect(from).toHaveBeenCalledWith('subscriptions')
//       expect(destroy).toHaveBeenCalledWith({ returning: 'minimal' })
//       expect(eqFilter).toHaveBeenCalledWith('user_id', userId)
//       expect(eqFilter).toHaveBeenCalledWith('hook_url', hookUrl)
    })

    describe('when it fails', () => {
//       const error = new Error('foo')

      beforeEach(() => {
//         eqFilter.mockImplementationOnce(() => mockSupabase)
//         eqFilter.mockImplementationOnce(() => { throw error })
      })

      it('throws the error', () => {
//         return expect(() => sut.deleteSubscription(userId, hookUrl)).rejects.toEqual(error)
      })
    })
  })
})
