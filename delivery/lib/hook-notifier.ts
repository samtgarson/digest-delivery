import axios from 'axios'
import { DataClient } from 'common/data-client'
import { errorLog } from 'common/logger'
import { dehydrate } from 'common/util'
import { DigestEntityWithArticles, Subscription } from 'types/digest'

const dataClient = new DataClient()

export class HookNotifier {
	constructor (
		private client = dataClient
	) {}

	async notify (userId: string, digestId: string): Promise<void> {
		const subs = await this.client.getSubscriptions(userId)
		const digest = await this.client.getDigest(userId, digestId)

		if (!digest) throw new Error(`Could not find digest with ID ${digestId}`)

		await Promise.all(subs.map(s => this.deliver(digest, s)))
	}

	private async deliver (digest: DigestEntityWithArticles, sub: Subscription) {
		try {
			await axios.post(sub.hook_url, dehydrate(digest), { headers: { 'Content-Type': 'application/json' } })
		} catch (err) {
			if (axios.isAxiosError(err) && err.code === '410') {
				return await this.client.deleteSubscription(sub.user_id, sub.hook_url)
			}

			errorLog(err)
		}
	}
}
