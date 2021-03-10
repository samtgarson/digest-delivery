import { DataClient } from 'common/data-client'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PageWrapper } from 'src/components/atoms/page-wrapper'
import { DigestItem } from 'src/components/list/digest-item'
import { List } from 'src/components/list/list'
import { UserForm } from 'src/components/user-form'
import { authenticated } from 'src/lib/page-authenticator'
import { useDataClient } from 'src/lib/use-data-client'
import { DigestEntityWithMeta, User } from 'types/digest'

const errorMessageFor = (code: string, payload: Partial<User>) => {
  if (code === '23514' && !!payload.kindle_address) return (
    <span>Enter a valid <strong>Send to Kindle</strong> email</span>
  )

  if (code === '42501' && !! payload.active) return (
    <span>Please provide a <strong>Send to Kindle</strong> email before activating</span>
  )

  return 'Something went wrong'
}

const App: NextPage<{ user: User, digests: DigestEntityWithMeta[] }> = ({ user: u, digests }) => {
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
    <h1 className="text-4xl mb-5 font-bold">Your Digest</h1>
    <UserForm user={user} updateUser={updateUser} />
    <h2 className="text-2xl font-bold mt-14 mb-4">Recent Digests</h2>
    <List className="" data={digests} item={DigestItem} />
  </PageWrapper>
}

export const getServerSideProps = authenticated(async (_ctx, user) => {
 const client = new DataClient()
 const digests = await client.getDigests(user.id, { count: 3 })
 return { props: { digests } }
})
export default App
