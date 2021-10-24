import type { NextPage } from 'next'
import Link from 'next/link'
import { Anchor } from 'src/components/atoms/btn'
import { Icon } from 'src/components/atoms/icon'
import { BlobWrapper } from 'src/components/blob-wrapper'
import { Benefits } from 'src/components/marketing/benefits'

const Home: NextPage = () => {
  return (
    <>
      <BlobWrapper>
        <Icon className='mx-auto mb-4' />
        <h1 className='mb-4 text-5xl uppercase'>Digest Delivery</h1>
        <p className='my-6'>
          Get your feeds, articles and newsletters delivered to your Kindle.
        </p>
        <Link href='/dashboard' passHref>
          <Anchor>Start reading easier</Anchor>
        </Link>
      </BlobWrapper>
      <div className='bg-whiteFade mt-36 py-14'>
        <section className='max-w-5xl mx-auto px-2 sm:px-4'>
          <Benefits />
        </section>
      </div>
      <div className='mt-36 py-14'>
        {/* <Image src="/kindle.png" height={650} width={580} /> */}
      </div>
    </>
  )
}

export default Home
