import 'next-auth'

declare module 'next-auth' {
  interface JWT {
    userId: string
    name: string
    picture: string
    email: string
  }

  interface Session {
    userId: string
    name: string
    picture: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    name: string
    picture: string
    email: string
  }
}
