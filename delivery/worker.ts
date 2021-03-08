import { DataClient } from "common/data-client"
import { withPrefix } from "common/logger"
import { ArticleCompiler } from "./lib/article-compiler"
import { Digest } from "./lib/digest"
import { Mailer } from "./lib/mailer"
import { expose } from "threads/worker"
import type { Deliver } from 'types/worker'

const compiler = new ArticleCompiler()
const mailer = new Mailer()
const data = new DataClient()

export const deliver: Deliver = async (userId: string, coverPath: string) => {
	const logger = withPrefix(userId)
	const articles = await data.getUnprocessedArticles(userId)

	if (!articles.length) {
		logger("no articles")
		return
	}
	logger(`delivering ${articles.length} articles`)

	const digest = new Digest(articles, new Date())

	const path = await compiler.compile(digest, coverPath)
	logger('converted html')
	await mailer.sendEmail(path)
	logger('email sent')
	await data.createDigest(userId, articles)
	logger('created digest')
}

expose(deliver)
