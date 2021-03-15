import { DataClient } from "common/data-client"
import { dateString, humaniseDate } from "common/util"
import { NextPage } from "next"
import { PageWrapper } from "src/components/atoms/page-wrapper"
import { ArticleItem } from "src/components/list/article-item"
import { List } from "src/components/list"
import { authenticated } from "src/lib/page-authenticator"
import { DigestEntityWithArticles } from "types/digest"

const DigestShow: NextPage<{ digest: DigestEntityWithArticles }> = ({ digest }) => {
  return <PageWrapper>
    <h1 className="title">Digest</h1>
    <div className="flex mt-6">
      <img src={`/api/covers/${dateString(digest.delivered_at)}.png`} className="h-64 mr-5 rounded" />
      <div className="flex-grow">
        <h2 className="subtitle">{ humaniseDate(digest.delivered_at) }</h2>
        <h3 className="font-bold mb-2 text-xl">Articles</h3>
        <List ordered data={digest.articles} item={ArticleItem} />
      </div>
    </div>
  </PageWrapper>
}

export const getServerSideProps = authenticated(async ({ params }, user) => {
  const client = new DataClient()
  const { id } = params as { id: string }
  const digest = await client.getDigest(user.id, id)

  if (!digest) return { notFound: true }

  return { props: { digest } }
})

export default DigestShow
