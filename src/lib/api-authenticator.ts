import { DataClient } from "common/data-client"
import { NextApiRequest } from "next"
import { User } from "types/digest"
import { ApiKey } from "./api-key"
import { getUser } from "./get-user"

const client = new DataClient()

export const protectWithApiKey = async (key?: string): Promise<null | User> => {
  if (!key) return null
  const encryptedKey = ApiKey.encrypt(key)
  return await client.validateApiKey(encryptedKey) || null
}

export const authenticate = async (req: NextApiRequest, internal = false) => {
  const { userId } = await getUser({ req })
  if (userId) {
    const user = await client.getUser(userId)
    if (user) return { user, external: false }
    if (internal) return {}
  }

  const user = await protectWithApiKey(req.headers.authorization)
  if (user) return { user, external: true }

  return {}
}
