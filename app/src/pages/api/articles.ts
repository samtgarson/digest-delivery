import { errorLog } from 'common/logger'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DataClient } from '../../../common/data-client'
import { protectWithApiKey } from '../../lib/api-authenticator'
import { validateArticlesRequest } from '../../lib/request-validator'

const dataClient = new DataClient()
const defaultDependencies = { dataClient }

const handler = async (req: NextApiRequest, res: NextApiResponse, { dataClient } = defaultDependencies) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const result = validateArticlesRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })

  try {
    await dataClient.createArticle(user.id, result.article)

    res.status(204).end()
  } catch (err) {
    errorLog(err)
    res.status(500).json({ error: { body: (err as Error).message } })
  }
}

export default handler
