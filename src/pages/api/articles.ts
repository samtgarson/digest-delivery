import type { NextApiHandler } from 'next'
import { protectWithApiKey } from 'src/lib/api-authenticator'
import { DataClient } from '../../../common/data-client'
import { validateArticlesRequest } from '../../lib/request-validator'

const data = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const result = validateArticlesRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })

  try {
    await data.createArticle(user.id, result.article)

    res.status(201).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

export default handler
