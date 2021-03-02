import { DataClient } from "common/data-client"
import { GetServerSideProps, NextPage } from "next"
import { useCallback } from "react"
import { BlobWrapper } from "src/components/blob-wrapper"
import { Btn } from "src/components/btn"
import { useSupabase } from "use-supabase"

const Login: NextPage = () => {
  const { auth } = useSupabase()
  const signUp = useCallback(() => {
    auth.signIn({ provider: 'google', redirectTo: new URL('/app', window.location.origin) })
  }, [auth])

  return <BlobWrapper>
    <h1>Sign In</h1>
    <p>Use your Google account to access your Digest Delivery dashboard.</p>
    <Btn onClick={signUp}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png" height="20" style={{ backgroundColor: 'white', padding: 3, borderRadius: 50 }} />
      <span>Continue with Google</span>
    </Btn>
  </BlobWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = new DataClient()
  const { user } = await client.auth.api.getUserByCookie(req)

  if (user) return { redirect: { destination: '/app', permanent: false } }
  return { props: { user } }
}

export default Login
