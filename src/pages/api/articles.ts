import type { NextApiHandler } from 'next'
import { protectWithApiKey } from '../../lib/api-authenticator'
import { DataClient } from '../../../common/data-client'
import { validateArticlesRequest } from '../../lib/request-validator'
import { errorLog } from 'common/logger'

const data = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const result = validateArticlesRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })

  try {
    await data.createArticle(user.id, result.article)

    res.status(204).end()
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

export default handler
