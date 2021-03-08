import type { DeliveryWorker } from "types/worker"
import { DataClient } from "../common/data-client"
import { log } from "../common/logger"
import { CoverGenerator } from "./lib/cover-generator"
import { humaniseDate } from "./lib/util"

const data = new DataClient()
const coverGenerator = new CoverGenerator()

export const handler = async (deliver: DeliveryWorker): Promise<void> => {
  log('beginning delivery')

  const users = await data.getDueUsers()
  if (users.length === 0) {
    log('no due users today')
    return
  }

  log(`Found ${users.length} users`)

  const date = humaniseDate(new Date())
  const coverPath = await coverGenerator.generate(date)
  log('generated cover')

  const jobs = users.map(userId => deliver(userId, coverPath))

  await Promise.all(jobs)

  log('completed delivery')
}

