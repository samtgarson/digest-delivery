import "next-auth"

declare module "next-auth" {
  interface JWT {
    userId: string
  }

  interface Session {
    userId: string
  }
}
