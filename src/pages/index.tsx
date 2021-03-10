import type { NextPage } from 'next'
import { Anchor } from 'src/components/atoms/btn'
import { BlobWrapper } from 'src/components/blob-wrapper'
import { Icon } from 'src/components/atoms/icon'
import React from 'react'
import Link from 'next/link'

const Home: NextPage = () => {
  return <BlobWrapper>
    <Icon className="mx-auto mb-4" />
    <h1 className="mb-4 text-5xl uppercase">Digest Delivery</h1>
    <p className="my-6">Get your feeds, articles and newsletters delivered to your Kindle.</p>
    <Link href="/dashboard" passHref>
      <Anchor>Start reading easier</Anchor>
    </Link>
  </BlobWrapper>
}

export default Home
