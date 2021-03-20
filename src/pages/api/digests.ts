import { errorLog } from 'common/logger'
import type { NextApiHandler } from 'next'
import { DataClient } from '../../../common/data-client'
import { protectWithApiKey } from '../../lib/api-authenticator'

const data = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const { perPage = 10, page = 0 } = req.query as { perPage?: number, page?: number }

  try {
    const result = await data.getDigests(user.id, { perPage, page, includeArticles: true })

    res.status(200).json(result.data)
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

export default handler

