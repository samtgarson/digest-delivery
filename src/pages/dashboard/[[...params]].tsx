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
import { InternalApiClient } from 'src/lib/internal-api-client'
import { authenticated } from 'src/lib/page-authenticator'
import { Article, DigestEntityWithMeta, User } from 'types/digest'

const calculator = new DeliveryDateCalculator()
const client = new InternalApiClient()

type DashboardProps = {
  user: User
  digests: DigestEntityWithMeta[]
  articles: Article[]
  nextDeliveryDate: Date
}

const Dashboard: NextPage<DashboardProps> = ({ user: u, digests, articles, nextDeliveryDate }) => {
  const [user, setUser] = useState(u)

  const updateUser = async (payload: Partial<User>) => {
    if (payload.kindleAddress === null) payload.active = false
    const { ok, error } = await client.updateUser(payload)
    if (!ok) {
      const msg = error || 'Something went wrong'
      toast.error(msg, { icon: null })
    } else {
      setUser({ ...user, ...payload })
    }
  }

  return <PageWrapper title="Dashboard">
    <h1 className="title">Your Digest</h1>
    <UserForm user={user} updateUser={updateUser} />
    <h2 className="subtitle mt-14">Your Next Digest</h2>
    <NextDigestItem delivery={nextDeliveryDate} count={articles.length} active={user.active} />
    { digests.length > 0 && <>
      <h2 className="subtitle mt-14">
        Recent Digests
        <Link passHref href="/digests">
          <Anchor naked small className="float-right text-sm uppercase">See all</Anchor>
        </Link>
      </h2>
      <List className="" data={digests} item={DigestItem} />
      </>
    }
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
