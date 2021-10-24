import { IncomingMessage } from "http"
import { NextApiRequest } from "next"
import { getToken, JWT } from "next-auth/jwt"

export const getUser = async ({ req }: { req?: IncomingMessage }): Promise<Partial<JWT>> => {
  if (!req) return {}
  return await getToken({ req: req as NextApiRequest, secret: process.env.SECRET_KEY }) || {}
}
