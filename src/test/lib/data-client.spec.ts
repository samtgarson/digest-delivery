import { SupabaseClient } from '@supabase/supabase-js'
import type { Article } from 'types/digest'
import { DataClient } from '../../lib/data-client'

const from = jest.fn()
const insert = jest.fn()
const select = jest.fn()
const destroy = jest.fn()
const inFilter = jest.fn()

const mockSupabase = {
  from: from.mockReturnThis(),
  select: select.mockReturnThis(),
  insert: insert.mockResolvedValue({}),
  delete: destroy.mockReturnThis(),
  in: inFilter
} as unknown as SupabaseClient

describe('data client', () => {
  let sut: DataClient
  const title = 'i am a title'
  const content = 'i am a content'
  const author = 'i am a author'

  beforeEach(() => {
    sut = new DataClient(mockSupabase)
  })

  describe('createArticle', () => {
    it('creates the resource', async () => {
      await sut.createArticle(title, content, author)

      expect(from).toHaveBeenCalledWith('articles')
      expect(insert).toHaveBeenCalledWith([{ title, content, author }], { returning: 'minimal' })
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        insert.mockResolvedValueOnce({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.createArticle(title, content, author)).rejects.toEqual(error)
      })
    })
  })

  describe('getUnprocessedArticles', () => {
    const articles = ['foo']

    beforeEach(() => {
      select.mockResolvedValue({ data: articles })
    })

    it('fetches the unprocessed articles', async () => {
      await sut.getUnprocessedArticles()

      expect(from).toHaveBeenCalledWith('articles')
      expect(select).toHaveBeenCalledWith('*')
    })

    it('returns the articles', async () => {
      const result = await sut.getUnprocessedArticles()

      expect(result).toEqual(articles)
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        select.mockResolvedValueOnce({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.getUnprocessedArticles()).rejects.toEqual(error)
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
        inFilter.mockResolvedValueOnce({ error })
      })

      it('throws the error', () => {
        return expect(() => sut.destroyProcessedArticles(articles)).rejects.toEqual(error)
      })
    })

  })
})
