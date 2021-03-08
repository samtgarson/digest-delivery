/* eslint-disable promise/prefer-await-to-callbacks */
import { handler } from './app'
import { spawn, Worker } from 'threads'
import { deliver } from './worker'
import { Thread } from 'threads'

const main = async () => {
  const worker = await spawn<typeof deliver>(new Worker('./worker.js'))
  await handler(worker)
  await Thread.terminate(worker)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
