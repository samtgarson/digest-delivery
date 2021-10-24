import { DataClient } from '@digest-delivery/common/data-client'
import type { NextApiHandler } from 'next'
import { authenticate } from 'src/lib/api-authenticator'

const client = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const { user, external } = await authenticate(req)
  if (!user) return res.status(401).end()

  if (req.method === 'PATCH') {
    const attrs = { ...user, ...req.body }

    if (attrs.active && !attrs.kindleAddress) {
      return res
        .status(422)
        .json({ error: 'Please provide a Kindle address before activating.' })
    }
    const updated = await client.updateUser(user.id, req.body)
    return res.status(200).json(updated)
  }

  if (external) {
    const { kindleAddress, ...publicUser } = user
    return res.status(200).json(publicUser)
  }
  return res.status(200).json(user)
}

export default handler
