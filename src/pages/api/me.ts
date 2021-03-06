import type { NextApiHandler } from 'next'
import { protectWithApiKey } from 'src/lib/api-authenticator'

const handler: NextApiHandler = async (req, res) => {
  const user = await protectWithApiKey(req.headers['authorization'])
  if (!user) return res.status(401).end()

  const { kindle_address, ...publicUser } = user

  return res.status(200).json(publicUser)
}

export default handler
