import { IncomingMessage } from "http"
import { NextApiRequest } from "next"
import { getToken, JWT } from "next-auth/jwt"

export type GetUser = Partial<JWT> & { loggedIn: boolean }

export const getUser = async ({ req }: { req?: IncomingMessage }): Promise<GetUser> => {
  if (!req) return { loggedIn: false }
  const jwt = await getToken({ req: req as NextApiRequest, secret: process.env.SECRET_KEY })

  if (!jwt) return { loggedIn: false }
  return { ...jwt, loggedIn: true }
}
