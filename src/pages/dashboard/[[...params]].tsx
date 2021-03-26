import { DataClient } from 'common/data-client'
import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Anchor } from 'src/components/atoms/btn'
import { PageWrapper } from 'src/components/atoms/page-wrapper'
import IntegrationHelp from 'src/components/integration-help'
import { List } from 'src/components/list'
import { DigestItem } from 'src/components/list/digest-item'
import { NextDigestItem } from 'src/components/list/next-digest-item'
import { UserForm } from 'src/components/user-form'
import { DeliveryDateCalculator } from 'src/lib/delivery-date-calculator'
import { authenticated } from 'src/lib/page-authenticator'
import { useDataClient } from 'src/lib/use-data-client'
import { Article, DigestEntityWithMeta, User } from 'types/digest'

const calculator = new DeliveryDateCalculator()

const errorMessageFor = (code: string, payload: Partial<User>) => {
  if (code === '23514' && !!payload.kindle_address) return (
    <span>Enter a valid <strong>Send to Kindle</strong> email</span>
  )

  if (code === '42501' && !! payload.active) return (
    <span>Please provide a <strong>Send to Kindle</strong> email before activating</span>
  )

  return 'Something went wrong'
}

type DashboardProps = { user: User, digests: DigestEntityWithMeta[], articles: Article[], nextDeliveryDate: Date }

const Dashboard: NextPage<DashboardProps> = ({ user: u, digests, articles, nextDeliveryDate }) => {
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

  return <PageWrapper title="Dashboard">
    <h1 className="title">Your Digest</h1>
    <UserForm user={user} updateUser={updateUser} />
    <h2 className="subtitle mt-14">Your Next Digest</h2>
    <NextDigestItem delivery={nextDeliveryDate} count={articles.length} active={user.active} />
    <h2 className="subtitle mt-14">
      Recent Digests
      <Link passHref href="/digests">
        <Anchor naked small className="float-right text-sm uppercase">See all</Anchor>
      </Link>
    </h2>
    <List className="" data={digests} item={DigestItem} />
    <IntegrationHelp />
  </PageWrapper>
}

export const getServerSideProps = authenticated(async (ctx, user) => {
  const [param] = ctx.query.params ?? [] as string[]
  if (![undefined, 'integration-help'].includes(param)) return { notFound: true }

  const client = new DataClient()
  const [{ data: digests }, articles, nextDeliveryDate] = await Promise.all([
    client.getDigests(user.id, { perPage: 3 }),
    client.getArticles(user.id, { unprocessed: true }),
    calculator.calculate(user.id)
  ])

  return { props: { digests, articles, nextDeliveryDate } }
})

export default Dashboard
