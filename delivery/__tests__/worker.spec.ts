import { DataClient } from '@digest-delivery/common/data-client'
import { Mailer } from '@digest-delivery/common/mailer'
import { ArticleCompiler } from 'delivery/lib/article-compiler'
import { HookNotifier } from 'delivery/lib/hook-notifier'
import { mockDeep } from 'jest-mock-extended'
import type { Article, DigestEntity, User } from 'types/digest'
import { DeliveryDependencies } from 'types/worker'
import { Digest } from '../lib/digest'
import { deliver } from '../worker'

jest.mock('threads/worker')
const mailer = mockDeep<Mailer>()
const articleCompiler = mockDeep<ArticleCompiler>()
const dataClient = mockDeep<DataClient>()
const hookNotifier = mockDeep<HookNotifier>()

const dependencies: DeliveryDependencies = {
  dataClient,
  mailer,
  hookNotifier,
  articleCompiler
}

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
      dataClient.getArticles.mockResolvedValue(articles)
      articleCompiler.compile.mockResolvedValue(path)
      dataClient.createDigest.mockResolvedValue({ id: digestId } as DigestEntity)
      await deliver(user, coverPath, dependencies)
    })

    it('fetches the unprocessed articles', () => {
      expect(dataClient.getArticles).toHaveBeenCalled()
    })

    it('compiles the articles', () => {
      expect(articleCompiler.compile).toHaveBeenCalledWith(new Digest(userId, articles, expect.any(Date)), coverPath)
    })

    it('sends the email', () => {
      expect(mailer.sendDigestEmail).toHaveBeenCalledWith(path, kindleAddress, email)
    })

    it('creates the digest', () => {
      expect(dataClient.createDigest).toHaveBeenCalledWith(userId, articles)
    })

    it('notifes the hooks', () => {
      expect(hookNotifier.notify).toHaveBeenCalledWith(userId, digestId)
    })
  })

  describe('when there are no articles', () => {
    beforeEach(async () => {
      dataClient.getArticles.mockResolvedValue([])
      await deliver(user, coverPath, dependencies)
    })

    it('does not proceed', async () => {
      expect(articleCompiler.compile).not.toHaveBeenCalled()
      expect(mailer.sendDigestEmail).not.toHaveBeenCalled()
      expect(dataClient.createDigest).not.toHaveBeenCalled()
    })
  })

  describe('when there is no kindle address', () => {
    beforeEach(async () => {
      await deliver({ id: userId, kindleAddress: null } as User, coverPath, dependencies)
    })

    it('does not proceed', async () => {
      expect(dataClient.getArticles).not.toHaveBeenCalled()
      expect(articleCompiler.compile).not.toHaveBeenCalled()
      expect(mailer.sendDigestEmail).not.toHaveBeenCalled()
      expect(dataClient.createDigest).not.toHaveBeenCalled()
    })
  })
})
