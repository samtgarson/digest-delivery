import { DataClient } from "common/data-client"
import { GetServerSideProps, NextPage } from "next"
import React, { useState } from "react"
import { CheckCircle, XCircle } from 'react-feather'
import { toast } from 'react-hot-toast'
import { Btn } from "src/components/btn"
import { Form } from "src/components/form"
import { FieldSet } from "src/components/form/field-set"
import { RadioList } from "src/components/form/radio-list"
import { TextInput } from "src/components/form/text-input"
import { PageWrapper } from "src/components/page-wrapper"
import { useDataClient } from "src/lib/use-data-client"
import { Frequency, User } from "types/digest"

const items = {
  Daily: Frequency.Daily,
  Weekly: Frequency.Weekly
}

const errorMessageFor = (code: string, payload: Partial<User>) => {
  if (code === '23514' && !!payload.kindle_address) return <span>Enter a valid <strong>Send to Kindle</strong> email</span>
  if (code === '42501' && !! payload.active) return <span>Please provide a <strong>Send to Kindle</strong> email before activating</span>

  return 'Something went wrong'
}

const App: NextPage<{ user: User }> = ({ user: u }) => {
  const client = useDataClient()
  const [user, setUser] = useState(u)
  const { frequency, kindle_address: address, active } = user

  const updateUser = async (payload: Partial<User>) => {
    try {
      if (payload.kindle_address === null) payload.active = false
      await client.updateUser(user.id, payload)
      setUser({ ...user, ...payload })
    } catch (e) {
      const msg = errorMessageFor(e.code, payload)
      toast(msg)
    }
  }

  const Icon = active ? CheckCircle : XCircle

  return <PageWrapper>
    <Form>
      <h1 className="text-4xl mb-5 font-bold">Your Digest</h1>
      <FieldSet highlight>
        <p className="flex items-center mb-3 sm:mb-0"><Icon className="inline-block mr-2" /> Your digest is { active ? 'active' : 'inactive' }</p>
        <Btn type="button" secondary={active} onClick={() => updateUser({ active: !active }) }>
          { active ? 'Deactivate' : 'Activate' }
        </Btn>
      </FieldSet>
      <FieldSet>
        <p className="mb-3 sm:mb-0">Your digest is delivered</p>
        <RadioList value={frequency} items={items} update={frequency => updateUser({ frequency })} />
      </FieldSet>
      <FieldSet>
        <p className="mb-3 sm:mb-0">Your Send to Kindle email is</p>
        <TextInput value={address} update={kindle_address => updateUser({ kindle_address })} className="w-full sm:w-60 -mr-2" />
      </FieldSet>
    </Form>
  </PageWrapper>
}

export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl }) => {
  const client = new DataClient()
  const { user: auth } = await client.auth.api.getUserByCookie(req)

  if (!auth) return { redirect: { destination: `/login?redirect=${resolvedUrl}`, permanent: false } }

  const user = await client.getUser(auth.id)

  if (!user) return { notFound: true }
  return { props: { user } }
}

export default App
