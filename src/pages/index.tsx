import type { NextPage } from 'next'
import { Anchor } from 'src/components/btn'
import { BlobWrapper } from 'src/components/blob-wrapper'
import { Icon } from 'src/components/icon'
import styles from '../styles/pages/home.module.scss'
import React from 'react'
import Link from 'next/link'

const Home: NextPage = () => {
  return <BlobWrapper>
    <Icon className={styles.icon} />
    <h1 className={styles.title}>Digest Delivery</h1>
    <p className={styles.lede}>Get your feeds, articles and newsletters delivered to your Kindle.</p>
    <Link href="/login" passHref>
      <Anchor>Start reading easier</Anchor>
    </Link>
  </BlobWrapper>
}

export default Home
