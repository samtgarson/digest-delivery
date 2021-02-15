import { ArticleCompiler } from "../lib/article-compiler"
import { DataClient } from "../lib/data-client"
import { Digest } from "../lib/digest"
import { Mailer } from "../lib/mailer"
import type { ScheduledHandler } from 'aws-lambda'

const data = new DataClient()
const compiler = new ArticleCompiler()
const mailer = new Mailer()

export const handler: ScheduledHandler = async () => {
  const articles = await data.getUnprocessedArticles()

  if (!articles.length) {
    console.log("No articles today")
    return
  }

  const digest = new Digest(articles, new Date())
  const path = await compiler.compile(digest)

  await mailer.sendEmail(path)
  await data.destroyProcessedArticles(articles)
}
