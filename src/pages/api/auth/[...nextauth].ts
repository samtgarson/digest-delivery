import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { withPrefix } from "common/logger"
import { Mailer } from "common/mailer"
import NextAuth from "next-auth"
import EmailProvider from 'next-auth/providers/email'

const mailer = new Mailer()
const prisma = new PrismaClient()
const logger = withPrefix('next-auth')

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET_KEY,
  session: {
    jwt: true
  },
  providers: [
    EmailProvider({
      async sendVerificationRequest ({ identifier, url }) {
        await mailer.sendSignInEmail(identifier, url)
      }
    })
  ],
  callbacks: {
    async jwt ({ user, token }) {
      if (user) token.userId = user.id
      return token
    },
    async session ({ session, token: { userId } }) {
      if (userId) session.userId = `${userId}`
      return session
    }
  },
  pages: {
    error: '/login'
  },
  debug: !!process.env.DEBUG,
  logger: {
    error (code, metadata) {
      logger.error(code, metadata)
    },
    warn (code) {
      logger.warn(code)
    }
  }
})
