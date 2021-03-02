import { createClient } from "@supabase/supabase-js"
import { DataClient } from "common/data-client"
import { GetServerSideProps, NextPage } from "next"
import getConfig from 'next/config'

const App: NextPage = () => {
  return <p>App</p>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = new DataClient()
  const { user } = await client.auth.api.getUserByCookie(req)

  if (!user) return { redirect: { destination: '/login', permanent: false } }
  return { props: { user } }
}

export default App
