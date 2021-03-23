import { errorLog } from 'common/logger'
import { AuthedHandler } from 'types/digest'
import { DataClient } from '../../../common/data-client'

const data = new DataClient()

const handler: AuthedHandler = async (req, res, user) => {
  if (req.method !== 'POST') return req.status(405).end()

  const hookUrl = req.body.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    const subscription = await data.createSubscription(user.id, hookUrl)

    res.status(200).json(subscription)
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

export default handler

