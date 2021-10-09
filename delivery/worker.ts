import { DataClient } from "common/data-client"
import { withPrefix } from "common/logger"
import { ArticleCompiler } from "./lib/article-compiler"
import { Digest } from "./lib/digest"
import { Mailer } from "./lib/mailer"
import { expose } from "threads/worker"
import type { Deliver } from 'types/worker'
import { User } from "types/digest"
import { HookNotifier } from "./lib/hook-notifier"

const compiler = new ArticleCompiler()
const mailer = new Mailer()
const data = new DataClient()
const notifier = new HookNotifier()

export const deliver: Deliver = async (user: User, coverPath: string) => {
	const logger = withPrefix(user.id)
	if (!user.kindleAddress) {
		logger.error('No kindleAddress')
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

	await mailer.sendEmail(path, user.kindleAddress, user.email)
	logger.log('email sent')

	const { id } = await data.createDigest(user.id, articles)
	logger.log('created digest')

	await notifier.notify(user.id, id)
	logger.log('notified hooks')
}

expose(deliver)
