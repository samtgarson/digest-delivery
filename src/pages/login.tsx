import { GetServerSideProps, NextPage } from "next"
import { signIn } from "next-auth/react"
import Head from "next/head"
import { Btn } from "src/components/atoms/btn"
import { BlobWrapper } from "src/components/blob-wrapper"
import { getUser } from "src/lib/get-user"

const googleIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png"
const Login: NextPage<{ callbackUrl: string }> = ({ callbackUrl }) => {
  const doSignIn = () => {
    signIn('google', { callbackUrl })
  }

  return <BlobWrapper>
    <Head><title>Login | Digest Delivery</title></Head>
    <h1 className="mb-4 text-3xl">Sign In</h1>
    <p className="mb-4">Use your Google account to access your Digest Delivery dashboard.</p>
    <Btn onClick={doSignIn}>
      <img src={googleIcon} className="p-1 bg-white rounded-full h-7 w-7 mr-2" />
      <span>Continue with Google</span>
    </Btn>
  </BlobWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { redirect = '/dashboard' } }) => {
  const session = await getUser({ req })

  if (session) return { redirect: { destination: '/dashboard', permanent: false } }

  const host = `${process.env.BASE_SCHEME}://${process.env.BASE_URL}`
  const callbackUrl = new URL(redirect as string, host).toString()
  return { props: { callbackUrl } }
}
export default Login
