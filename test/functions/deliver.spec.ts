import { handler } from '../../functions/deliver'
import * as DataClient from '../../lib/data-client'
import * as MockDataClient from '../../lib/__mocks__/data-client'
import * as Mailer from '../../lib/mailer'
import * as MockMailer from '../../lib/__mocks__/mailer'
import * as ArticleCompiler from '../../lib/article-compiler'
import * as MockArticleCompiler from '../../lib/__mocks__/article-compiler'
import { Article } from '../../types/digest'
import { Digest } from '../../lib/digest'
import type { ScheduledEvent, Context } from 'aws-lambda'

jest.mock('../../lib/data-client')
jest.mock('../../lib/mailer')
jest.mock('../../lib/article-compiler')

const { getUnprocessedArticlesMock, destroyProcessedArticlesMock } =  DataClient as unknown as typeof MockDataClient
const { sendEmailMock } =  Mailer as unknown as typeof MockMailer
const { compileMock } =  ArticleCompiler as unknown as typeof MockArticleCompiler

describe('queue', () => {
  const articles = [{}] as Article[]
  const path = 'path'
  const event = {} as ScheduledEvent
  const context = {} as Context

  beforeEach(async () => {
    getUnprocessedArticlesMock.mockResolvedValue(articles)
    compileMock.mockReturnValue(path)
    await handler(event, context, jest.fn())
  })

  it('fetches the unprocessed articles', () => {
    expect(getUnprocessedArticlesMock).toHaveBeenCalled()
  })

  it('compiles the articles', () => {
    expect(compileMock).toHaveBeenCalledWith(new Digest(articles, expect.any(Date)))
  })

  it('sends the email', () => {
    expect(sendEmailMock).toHaveBeenCalledWith(path)
  })

  it('destroys the articles', () => {
    expect(destroyProcessedArticlesMock).toHaveBeenCalledWith(articles)
  })
})
