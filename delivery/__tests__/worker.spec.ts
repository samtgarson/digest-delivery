import { deliver } from '../worker'
import * as DataClient from '../../common/data-client'
import * as MockDataClient from '../../common/__mocks__/data-client'
import * as Mailer from '../lib/mailer'
import * as MockMailer from '../lib/__mocks__/mailer'
import * as ArticleCompiler from '../lib/article-compiler'
import * as MockArticleCompiler from '../lib/__mocks__/article-compiler'
import type { Article, User } from 'types/digest'
import { Digest } from '../lib/digest'

jest.mock('threads/worker')
jest.mock('../../common/data-client')
jest.mock('../lib/mailer')
jest.mock('../lib/article-compiler')

const { getUnprocessedArticlesMock, createDigestMock } =  DataClient as unknown as typeof MockDataClient
const { sendEmailMock } =  Mailer as unknown as typeof MockMailer
const { compileMock } =  ArticleCompiler as unknown as typeof MockArticleCompiler

describe('queue', () => {
  const articles = [{}] as Article[]
  const path = 'path'
  const userId = 'user id'
  const kindleAddress = 'kindle address'
  const user = { id: userId, kindle_address: kindleAddress } as User
  const coverPath = 'cover path'

  beforeEach(() => jest.clearAllMocks())

  describe('when there are articles', () => {
    beforeEach(async () => {
      getUnprocessedArticlesMock.mockResolvedValue(articles)
      compileMock.mockReturnValue(path)
      await deliver(user, coverPath)
    })

    it('fetches the unprocessed articles', () => {
      expect(getUnprocessedArticlesMock).toHaveBeenCalled()
    })

    it('compiles the articles', () => {
      expect(compileMock).toHaveBeenCalledWith(new Digest(userId, articles, expect.any(Date)), coverPath)
    })

    it('sends the email', () => {
      expect(sendEmailMock).toHaveBeenCalledWith(path, kindleAddress)
    })

    it('creates the digest', () => {
      expect(createDigestMock).toHaveBeenCalledWith(userId, articles)
    })
  })

  describe('when there are no articles', () => {
    beforeEach(async () => {
      getUnprocessedArticlesMock.mockResolvedValue([])
      await deliver(user, coverPath)
    })

    it('does not proceed', async () => {
      expect(compileMock).not.toHaveBeenCalled()
      expect(sendEmailMock).not.toHaveBeenCalled()
      expect(createDigestMock).not.toHaveBeenCalled()
    })
  })

  describe('when there is no kindle address', () => {
    beforeEach(async () => {
      await deliver({ id: userId, kindle_address: null } as User, coverPath)
    })

    it('does not proceed', async () => {
      expect(getUnprocessedArticlesMock).not.toHaveBeenCalled()
      expect(compileMock).not.toHaveBeenCalled()
      expect(sendEmailMock).not.toHaveBeenCalled()
      expect(createDigestMock).not.toHaveBeenCalled()
    })
  })
})
