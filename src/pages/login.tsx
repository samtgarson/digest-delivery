import { GetServerSideProps, NextPage } from "next"
import { getSession, signIn } from "next-auth/react"
import Head from "next/head"
import { useState } from "react"
import { Btn } from "src/components/atoms/btn"
import { BlobWrapper } from "src/components/blob-wrapper"
import { FieldSet } from "src/components/form/field-set"
import { TextInput } from "src/components/form/text-input"

const Login: NextPage<{ callbackUrl: string }> = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [done, setDone] = useState<string | boolean>(false)
  // const [signInError, setError] = useState<string>()
  const doSignIn = async () => {
    const { error } = await signIn<'email'>('email', { email, redirect: false }) || {}
    setDone(error || true)
  }

  return <BlobWrapper>
    <Head><title>Login | Digest Delivery</title></Head>
    <h1 className="mb-4 text-3xl">Sign In</h1>
    { done === true ?
    <p>Check your email for a login link</p>
      : <>
      <FieldSet>
        <TextInput value={email} update={e => setEmail(e)} />
      </FieldSet>
      <Btn onClick={() => email?.length && doSignIn() }>Send me an email</Btn>
      </>
  }
  </BlobWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { redirect = '/dashboard' } }) => {
  const { user } = await getSession({ req }) || {}

  if (user) return { redirect: { destination: '/dashboard', permanent: false } }

  const host = `${process.env.BASE_SCHEME}://${process.env.BASE_URL}`
  const callbackUrl = new URL(`/auth?redirect=${redirect}`, host).toString()
  return { props: { callbackUrl } }
}
export default Login
