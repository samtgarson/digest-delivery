import type { NextPage } from 'next'
import { Btn } from 'src/components/btn'
import { Icon } from 'src/styles/components/icon'
import styles from '../styles/pages/home.module.scss'

const Home: NextPage = () => {
  return <main className={styles.wrapper}>
    <Icon className={styles.icon} />
    <h1 className={styles.title}>Digest Delivery</h1>
    <p className={styles.lede}>Get your feeds, articles and newsletters delivered to your Kindle.</p>
    <Btn>Start reading easier</Btn>
  </main>
}

export default Home
