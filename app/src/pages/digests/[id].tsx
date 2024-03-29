import { DataClient } from 'common/data-client'
import { dateString, humaniseDate } from 'common/util'
import { NextPage } from 'next'
import { PageWrapper } from 'src/components/atoms/page-wrapper'
import { List } from 'src/components/list'
import { ArticleItem } from 'src/components/list/article-item'
import { authenticated } from 'src/lib/page-authenticator'
import { DigestEntityWithArticles } from 'types/digest'

const DigestShow: NextPage<{ digest: DigestEntityWithArticles }> = ({
  digest
}) => {
  return (
    <PageWrapper title={`Digest ${humaniseDate(digest.deliveredAt)}`}>
      <div className='flex mt-6'>
        <img
          src={`https://assets.digest.delivery/cover-${dateString(
            digest.deliveredAt
          )}.png`}
          className='h-48 mr-5 mb-5 rounded'
        />
        <div className='flex-grow'>
          <h1 className='title mb-4'>Digest</h1>
          <h2 className='subtitle'>{humaniseDate(digest.deliveredAt)}</h2>
        </div>
      </div>
      <h3 className='font-bold mb-4 text-xl'>Articles</h3>
      <List ordered data={digest.articles} item={ArticleItem} />
    </PageWrapper>
  )
}

export const getServerSideProps = authenticated(async ({ params }, user) => {
  const client = new DataClient()
  const { id } = params as { id: string }

  try {
    const digest = await client.getDigest(user.id, id)
    if (!digest) return { notFound: true }

    return { props: { digest } }
  } catch (err) {
    // TODO: Error handling
    // if (err.code === '22P02' || err.message === 'JSON object requested, multiple (or no) rows returned') return { notFound: true }
    console.log(err)
    throw err
  }
})

export default DigestShow
