import { DataClient } from "common/data-client"
import { withPrefix } from "common/logger"
import { Mailer } from "common/mailer"
import { expose } from "threads/worker"
import type { Deliver, DeliveryDependencies } from 'types/worker'
import { ArticleCompiler } from "./lib/article-compiler"
import { Digest } from "./lib/digest"
import { HookNotifier } from "./lib/hook-notifier"

const defaultDependencies = (): DeliveryDependencies => ({
  articleCompiler: new ArticleCompiler(),
  mailer: new Mailer(),
  dataClient: new DataClient(),
  hookNotifier: new HookNotifier()
})

export const deliver: Deliver = async (user, coverPath, dependencies = defaultDependencies()) => {
  const { mailer, dataClient, hookNotifier, articleCompiler } = dependencies

	const logger = withPrefix(user.id)
	if (!user.kindleAddress) {
		logger.error('No kindleAddress')
		return
	}

	const articles = await dataClient.getArticles(user.id, { unprocessed: true })

	if (!articles.length) {
		logger.log("no articles")
		return
	}
	logger.log(`delivering ${articles.length} articles`)

	const digest = new Digest(user.id, articles, new Date())

	const path = await articleCompiler.compile(digest, coverPath)
	logger.log('converted html')

	await mailer.sendDigestEmail(path, user.kindleAddress, user.email)
	logger.log('email sent')

	const { id } = await dataClient.createDigest(user.id, articles)
	logger.log('created digest')

	await hookNotifier.notify(user.id, id)
	logger.log('notified hooks')
}

expose(deliver)
