import axios from 'axios'
import { DataClient } from '@digest-delivery/common/data-client'
import { errorLog } from '@digest-delivery/common/logger'
import { dehydrate } from '@digest-delivery/common/util'
import { DigestEntityWithArticles, Subscription } from 'types/digest'

const dataClient = new DataClient()

export class HookNotifier {
  constructor (private client = dataClient) {}

  async notify (userId: string, digestId: string): Promise<void> {
    const subs = await this.client.getSubscriptions(userId)
    const digest = await this.client.getDigest(userId, digestId)

    if (!digest) throw new Error(`Could not find digest with ID ${digestId}`)

    await Promise.all(subs.map(s => this.deliver(digest, s)))
  }

  private async deliver (digest: DigestEntityWithArticles, sub: Subscription) {
    try {
      await axios.post(sub.hookUrl, dehydrate(digest), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 410) {
        return await this.client.deleteSubscription(sub.userId, sub.hookUrl)
      }

      errorLog(err)
    }
  }
}
