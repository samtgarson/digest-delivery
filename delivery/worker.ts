import { DataClient } from "common/data-client"
import { withPrefix } from "common/logger"
import { ArticleCompiler } from "./lib/article-compiler"
import { Digest } from "./lib/digest"
import { Mailer } from "./lib/mailer"
import { expose } from "threads/worker"
import type { Deliver } from 'types/worker'
import { User } from "types/digest"

const compiler = new ArticleCompiler()
const mailer = new Mailer()
const data = new DataClient()

export const deliver: Deliver = async (user: User, coverPath: string) => {
	const logger = withPrefix(user.id)
	if (!user.kindle_address) {
		logger.error('No kindle_address')
		return
	}

	const articles = await data.getArticles(user.id, { unprocessed: true })

	if (!articles.length) {
		logger.log("no articles")
		return
	}
	logger.log(`delivering ${articles.length} articles`)

	const digest = new Digest(user.id, articles, new Date())

	const path = await compiler.compile(digest, coverPath)
	logger.log('converted html')

	await mailer.sendEmail(path, user.kindle_address)
	logger.log('email sent')

	await data.createDigest(user.id, articles)
	logger.log('created digest')
}

expose(deliver)
