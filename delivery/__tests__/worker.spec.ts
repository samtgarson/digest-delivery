import { deliver } from '../worker'
import * as DataClient from '../../common/data-client'
import * as MockDataClient from '../../common/__mocks__/data-client'
import * as Mailer from '../lib/mailer'
import * as MockMailer from '../lib/__mocks__/mailer'
import * as ArticleCompiler from '../lib/article-compiler'
import * as MockArticleCompiler from '../lib/__mocks__/article-compiler'
import * as HookNotifier from '../lib/hook-notifier'
import * as MockHookNotifier from '../lib/__mocks__/hook-notifier'
import type { Article, User } from 'types/digest'
import { Digest } from '../lib/digest'

jest.mock('threads/worker')
jest.mock('../../common/data-client')
jest.mock('../lib/mailer')
jest.mock('../lib/article-compiler')
jest.mock('../lib/hook-notifier')

const { getArticlesMock, createDigestMock } =  DataClient as unknown as typeof MockDataClient
const { sendEmailMock } =  Mailer as unknown as typeof MockMailer
const { compileMock } =  ArticleCompiler as unknown as typeof MockArticleCompiler
const { notifyMock } =  HookNotifier as unknown as typeof MockHookNotifier

describe('queue', () => {
  const articles = [{}] as Article[]
  const path = 'path'
  const userId = 'user id'
  const kindleAddress = 'kindle address'
  const email = 'email'
  const user = { id: userId, kindleAddress: kindleAddress, email } as User
  const coverPath = 'cover path'
  const digestId = 'digest id'

  beforeEach(() => jest.clearAllMocks())

  describe('when there are articles', () => {
    beforeEach(async () => {
      getArticlesMock.mockResolvedValue(articles)
      compileMock.mockReturnValue(path)
      createDigestMock.mockResolvedValue({ id: digestId })
      await deliver(user, coverPath)
    })

    it('fetches the unprocessed articles', () => {
      expect(getArticlesMock).toHaveBeenCalled()
    })

    it('compiles the articles', () => {
      expect(compileMock).toHaveBeenCalledWith(new Digest(userId, articles, expect.any(Date)), coverPath)
    })

    it('sends the email', () => {
      expect(sendEmailMock).toHaveBeenCalledWith(path, kindleAddress, email)
    })

    it('creates the digest', () => {
      expect(createDigestMock).toHaveBeenCalledWith(userId, articles)
    })

    it('notifes the hooks', () => {
      expect(notifyMock).toHaveBeenCalledWith(userId, digestId)
    })
  })

  describe('when there are no articles', () => {
    beforeEach(async () => {
      getArticlesMock.mockResolvedValue([])
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
      await deliver({ id: userId, kindleAddress: null } as User, coverPath)
    })

    it('does not proceed', async () => {
      expect(getArticlesMock).not.toHaveBeenCalled()
      expect(compileMock).not.toHaveBeenCalled()
      expect(sendEmailMock).not.toHaveBeenCalled()
      expect(createDigestMock).not.toHaveBeenCalled()
    })
  })
})
