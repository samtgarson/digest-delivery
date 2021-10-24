import { DataClient } from '@digest-delivery/common/data-client'
import { addDays, isFuture, isToday, startOfDay } from 'date-fns'
import { Frequency } from './util/frequency'

const dataClient = new DataClient()

export class DeliveryDateCalculator {
  constructor (private client = dataClient) {}

  async calculate (userId: string): Promise<Date> {
    const today = startOfDay(new Date())
    const [lastDigests, account] = await Promise.all([
      this.client.getDigests(userId, { perPage: 1 }),
      this.client.getUser(userId)
    ])

    const lastDelivered =
      lastDigests.total > 0
        ? new Date(lastDigests.data[0].deliveredAt)
        : addDays(today, -1)

    const days = account?.frequency === Frequency.Weekly ? 7 : 1

    const scheduled = startOfDay(addDays(lastDelivered, days))

    return isFuture(scheduled) || isToday(scheduled)
      ? scheduled
      : addDays(today, 1)
  }
}
