import { errorLog } from 'common/logger'
import type { NextApiHandler } from 'next'
import { AuthedHandler } from 'types/digest'
import { DataClient } from '../../../common/data-client'
import { protectWithApiKey } from '../../lib/api-authenticator'

const data = new DataClient()

const postHandler: AuthedHandler = async (req, res, user) => {
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

const deleteHandler: AuthedHandler = async (req, res, user) => {
  const hookUrl = req.body.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    await data.deleteSubscription(user.id, hookUrl)

    res.status(200).json({})
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

const handler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  switch (req.method) {
    case 'POST':
      return postHandler(req, res, user)
    case 'DELETE':
      return deleteHandler(req, res, user)
    default:
      return res.status(405).end()
  }
}

export default handler
