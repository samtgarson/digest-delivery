/* eslint-disable promise/prefer-await-to-callbacks */
import { handler } from '../src/functions/deliver'

handler()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
