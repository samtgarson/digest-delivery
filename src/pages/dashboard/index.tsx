import { NextPage } from 'next'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PageWrapper } from 'src/components/page-wrapper'
import { UserForm } from 'src/components/user-form'
import { authenticated } from 'src/lib/page-authenticator'
import { useDataClient } from 'src/lib/use-data-client'
import { User } from 'types/digest'

const errorMessageFor = (code: string, payload: Partial<User>) => {
  if (code === '23514' && !!payload.kindle_address) return (
    <span>Enter a valid <strong>Send to Kindle</strong> email</span>
  )

  if (code === '42501' && !! payload.active) return (
    <span>Please provide a <strong>Send to Kindle</strong> email before activating</span>
  )

  return 'Something went wrong'
}

const App: NextPage<{ user: User }> = ({ user: u }) => {
  const client = useDataClient()
  const [user, setUser] = useState(u)

  const updateUser = async (payload: Partial<User>) => {
    try {
      if (payload.kindle_address === null) payload.active = false
      await client.updateUser(user.id, payload)
      setUser({ ...user, ...payload })
    } catch (e) {
      const msg = errorMessageFor(e.code, payload)
      toast.error(msg, { icon: null })
    }
  }

  return <PageWrapper>
    <h1 className="text-4xl mb-5 px-7 font-bold">Your Digest</h1>
    <UserForm user={user} updateUser={updateUser} />
  </PageWrapper>
}

export const getServerSideProps = authenticated()
export default App
