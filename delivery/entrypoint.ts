/* eslint-disable promise/prefer-await-to-callbacks */
import { handler } from './app'
import { spawn, Worker } from 'threads'
import { Thread } from 'threads'
import { Deliver } from 'types/worker'

const main = async () => {
  const worker = await spawn<Deliver>(new Worker('../worker'))
  await handler(worker)
  await Thread.terminate(worker)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
