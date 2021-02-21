import { validateRequest } from '../../lib/request-validator'
import { DataClient } from '@digest-delivery/common/data-client'
import type { NextApiHandler } from 'next'

const data = new DataClient()

export const handler: NextApiHandler = async (req, res) => {
  const result = validateRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })
  const { content, title, author } = result

  try {
    await data.createArticle(title, content, author)

    res.status(201).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: { body: err.message } })
  }
}

