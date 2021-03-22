import { DataClient } from "common/data-client"
import { relativeDate } from "common/util"
import { NextPage } from "next"
import { PageWrapper } from "src/components/atoms/page-wrapper"
import { List } from "src/components/list"
import { ArticleItem } from "src/components/list/article-item"
import { DeliveryDateCalculator } from "src/lib/delivery-date-calculator"
import { authenticated } from "src/lib/page-authenticator"
import { Article } from "types/digest"

const calculator = new DeliveryDateCalculator()

const DigestShow: NextPage<{ articles: Article[], nextDeliveryDate: Date, active: boolean }> = ({ articles, nextDeliveryDate, active }) => {
  return <PageWrapper title="Next Digest">
    <h1 className="title">Your Next Digest</h1>
    { active && <h2 className="subtitle">Delivering { relativeDate(nextDeliveryDate) }</h2> }
    <h3 className="font-bold mb-2 text-xl">Articles</h3>
    { articles.length === 0
      ? <p>No articles yet!</p>
      : <List ordered data={articles} item={ArticleItem} />
    }
  </PageWrapper>
}

export const getServerSideProps = authenticated(async (_ctx, { id, active }) => {
  const client = new DataClient()
  const [articles, nextDeliveryDate] = await Promise.all([
    client.getArticles(id, { unprocessed: true }),
    calculator.calculate(id)
  ])

  return { props: { articles, nextDeliveryDate, active } }
})

export default DigestShow
