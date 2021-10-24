import { DataClient } from 'common/data-client'
import { errorLog } from 'common/logger'
import { AuthedHandler } from 'types/digest'

const data = new DataClient()

const handler: AuthedHandler = async (req, res, user) => {
  const hookUrl = req.query.hookUrl as string | undefined
  if (!hookUrl) return res.status(400).end()

  try {
    await data.deleteSubscription(user.id, hookUrl)

    res.status(200).json({})
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: (err as Error).message } })
  }
}

export default handler
