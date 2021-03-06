import { DataClient } from "common/data-client"
import { User } from "types/digest"
import { ApiKey } from "./api-key"

const client = new DataClient()

export const protectWithApiKey = async (key?: string): Promise<null | User> => {
  if (!key) return null
  const encryptedKey = ApiKey.encrypt(key)
  const userId = await client.validateApiKey(encryptedKey)
  if (!userId) return null

  return client.getUser(userId)
}
