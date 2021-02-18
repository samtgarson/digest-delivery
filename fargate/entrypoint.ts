/* eslint-disable promise/prefer-await-to-callbacks */
import { handler } from '../src/functions/deliver'

handler().catch(err => console.error(err))
