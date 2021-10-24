import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { DataClient } from 'common/data-client'
import { withPrefix } from 'common/logger'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const prisma = DataClient.createDefaultClient()
const logger = withPrefix('next-auth')

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET_KEY,
  session: {
    jwt: true
  },
  jwt: {
    secret: process.env.SECRET_KEY
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  callbacks: {
    async jwt ({ user, token }) {
      if (user) token.userId = user.id
      return token
    },
    async session ({ session, token: { userId, name, email } }) {
      session = {
        ...session,
        userId: `${userId || session.userId}`,
        name: `${name || session.name}`,
        email: `${email || session.email}`
      }
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
