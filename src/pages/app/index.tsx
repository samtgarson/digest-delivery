import { DataClient } from "common/data-client"
import { GetServerSideProps, NextPage } from "next"
import React from "react"
import { PageWrapper } from "src/components/page-wrapper"

const App: NextPage = () => {
  return <PageWrapper>App</PageWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = new DataClient()
  const { user } = await client.auth.api.getUserByCookie(req)

  if (!user) return { redirect: { destination: '/login', permanent: false } }
  return { props: { user } }
}

export default App
