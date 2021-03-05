import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"
import { useRouter } from 'next/router'

const Auth: NextPage<{ redirect: string }> = ({ redirect }) => {
  const router = useRouter()
  useEffect(() => {
    router.push(redirect)
  }, [])

  return null
}

export const getServerSideProps: GetServerSideProps = async ({ query: { redirect = '/app' } }) => ({ props: { redirect } })

export default Auth
