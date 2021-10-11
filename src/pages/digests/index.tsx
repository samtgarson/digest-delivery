import { DataClient } from "common/data-client"
import { NextPage } from "next"
import { Frown } from "react-feather"
import { PageWrapper } from "src/components/atoms/page-wrapper"
import { List } from "src/components/list"
import { DigestItem } from "src/components/list/digest-item"
import { authenticated } from "src/lib/page-authenticator"
import { DigestEntityWithMeta } from "types/digest"

type DigestsIndexProps = {
   digests: DigestEntityWithMeta[]
   page: number
   total: number
}

const DigestsIndex: NextPage<DigestsIndexProps> = ({ digests }) => {
  return <PageWrapper title='Digests'>
    <h1 className="title">Past Digests</h1>
    { digests.length
      ? <List data={digests} item={DigestItem} />
      : <p>
          No digests found
          <Frown className="ml-2 inline-block" />
        </p>
    }
  </PageWrapper>
}

export const getServerSideProps = authenticated(async ({ query }, user) => {
  const { page = 1 } = query as { page?: number }
  const client = new DataClient()
  const { data: digests, total } = await client.getDigests(user.id, { perPage: 10, page: page - 1 })

  return { props: { total, digests, page } }
})

export default DigestsIndex
