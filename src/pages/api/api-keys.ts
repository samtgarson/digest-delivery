import { DataClient } from "common/data-client"
import { NextApiHandler } from "next"
import { ApiKey } from "src/lib/api-key"

const client = new DataClient()

const handler: NextApiHandler = async (req, res) => {
  const { user } = await client.auth.api.getUserByCookie(req)
  if (!user) return res.status(401).end()

  const key = new ApiKey(user.id)
  await client.createApiKey(key)

  return res.status(201).json({ id: key.key })
}

export default handler
