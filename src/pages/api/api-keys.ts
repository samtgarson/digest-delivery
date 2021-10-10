import { DataClient } from "common/data-client"
import { NextApiHandler } from "next"
import { authenticate } from "src/lib/api-authenticator"
import { ApiKey } from "src/lib/api-key"

const client = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const { user } = await authenticate(req, true)
  if (!user) return res.status(401).end()

  const key = new ApiKey(user.id)
  await client.createApiKey(key)

  return res.status(201).json({ id: key.key })
}

export default handler
