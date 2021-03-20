import { errorLog } from 'common/logger'
import type { NextApiHandler } from 'next'
import { DataClient } from '../../../common/data-client'
import { protectWithApiKey } from '../../lib/api-authenticator'

const data = new DataClient()

const postHandler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const hookUrl = req.body.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    await data.createSubscription(user.id, hookUrl)

    res.status(204).end()
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

const deleteHandler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const hookUrl = req.body.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    await data.deleteSubscription(user.id, hookUrl)

    res.status(204).end()
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return postHandler(req, res)
    case 'DELETE':
      return deleteHandler(req, res)
    default:
      return res.status(405).end()
  }
}

export default handler
