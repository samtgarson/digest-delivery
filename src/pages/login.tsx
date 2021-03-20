import { DataClient } from "common/data-client"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useEffect } from "react"
import { Anchor } from "src/components/atoms/btn"
import { BlobWrapper } from "src/components/blob-wrapper"
import { setSession } from "src/lib/use-auth"
import { useSupabase } from "use-supabase"

const googleIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png"

const Login: NextPage<{ authUrl: string, redirect: string }> = ({ authUrl, redirect }) => {
  const supabase = useSupabase()
  useEffect(() => {
    const session = supabase.auth.session()
    if (session) {
      setSession('SIGNED_IN', session)
      location.assign(redirect)
    }
  })
  return <BlobWrapper>
    <h1 className="mb-4 text-3xl">Sign In</h1>
    <p className="mb-4">Use your Google account to access your Digest Delivery dashboard.</p>
    <Link passHref href={authUrl}>
      <Anchor>
        <img src={googleIcon} className="p-1 bg-white rounded-full h-7 w-7 mr-2" />
        <span>Continue with Google</span>
      </Anchor>
    </Link>
  </BlobWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { redirect = '/dashboard' } }) => {
  const client = new DataClient()
  const { user } = await client.auth.api.getUserByCookie(req)

  if (user) return { redirect: { destination: '/dashboard', permanent: false } }

  const host = `${process.env.BASE_SCHEME}://${process.env.BASE_URL}`
  const redirectTo = new URL(`/auth?redirect=${redirect}`, host).toString()
  const authUrl = client.auth.api.getUrlForProvider('google', { redirectTo })
  return { props: { authUrl, redirect } }
}

export default Login
