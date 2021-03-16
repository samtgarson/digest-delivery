import { DataClient } from "common/data-client"
import { addDays } from "date-fns"
import { Frequency } from "types/digest"

const dataClient = new DataClient()

export class DeliveryDateCalculator {
  constructor (
    private client = dataClient,
    private today = new Date(),
    private add: (d: Date, a: number) => Date = addDays
  ) {}

  async calculate (userId: string): Promise<Date> {
    const [lastDigests, account] = await Promise.all([
      this.client.getDigests(userId, { perPage: 1 }),
      this.client.getUser(userId)
    ])

    const lastDelivered = lastDigests.total > 0
      ? new Date(lastDigests.data[0].delivered_at)
      : this.add(this.today, -1)

    const days = account?.frequency === Frequency.Weekly ? 7 : 1

    return this.add(lastDelivered, days)
  }
}
