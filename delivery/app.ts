import { log } from "@digest-delivery/common/logger"
import { DataClient } from "@digest-delivery/common/data-client"
import { ArticleCompiler } from "./lib/article-compiler"
import { Digest } from "./lib/digest"
import { Mailer } from "./lib/mailer"

const data = new DataClient()
const compiler = new ArticleCompiler()
const mailer = new Mailer()

export const handler = async (): Promise<void> => {
  log('beginning delivery')
  const articles = await data.getUnprocessedArticles()

  if (!articles.length) {
    console.log("No articles today")
    return
  }
  log(`delivering ${articles.length} articles`)

  const digest = new Digest(articles, new Date())
  const path = await compiler.compile(digest)

  await mailer.sendEmail(path)
  log('email sent')
  await data.destroyProcessedArticles(articles)
  log('destroyed processed articles')
}

