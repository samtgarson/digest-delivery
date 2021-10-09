import { DataClient } from "common/data-client"
import { errorLog, log } from "common/logger"
import type { DeliveryWorker } from "types/worker"
import { CoverGenerator } from "./lib/cover-generator"
import { CoverUploader } from "./lib/cover-uploader"

const defaultDependencies = {
  dataClient: new DataClient(),
  coverGenerator: new CoverGenerator(),
  coverUploader: new CoverUploader()
}

export const handler = async (deliver: DeliveryWorker, deps = defaultDependencies): Promise<void> => {
  const { dataClient, coverGenerator, coverUploader } = deps
  log('beginning delivery')

  try {
    const users = await dataClient.getDueUsers()
    if (users.length === 0) {
      log('no due users today')
      return
    }

    log(`Found ${users.length} users`)

    const coverPath = await coverGenerator.generate(new Date())
    const uploadPromise = coverUploader.upload(coverPath)
    log('generated cover')

    const jobs = users.map(user => deliver(user, coverPath))

    await Promise.all([...jobs, uploadPromise])

    log('completed delivery')
  } catch (err) {
    errorLog(err)
    throw err
  }
}

