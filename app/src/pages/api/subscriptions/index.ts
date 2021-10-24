import { DataClient } from '@digest-delivery/common/data-client'
import { errorLog } from '@digest-delivery/common/logger'
import { AuthedHandler } from 'types/digest'

const data = new DataClient()

const handler: AuthedHandler = async (req, res, user) => {
  if (req.method !== 'POST') return res.status(405).end()

  const hookUrl = req.body.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    const subscription = await data.createSubscription(user.id, hookUrl)

    res.status(200).json(subscription)
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: (err as Error).message } })
  }
}

export default handler

