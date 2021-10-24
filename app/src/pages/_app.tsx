import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Nav } from 'src/components/atoms/nav'
import '../styles/global.css'
import FiveHundred from './500'

const toastOptions = {
  style: {
    color: 'var(--blue)'
  }
}

export default function CustomApp ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps): ReactNode {
  return (
    <SessionProvider>
      <Head>
        <title>Digest Delivery</title>
      </Head>
      <Head>
        <link rel='shortcut icon' href='/favicon.png' />
      </Head>
      <Nav />
      {pageProps._error ? <FiveHundred /> : <Component {...pageProps} />}
      <Toaster toastOptions={toastOptions} />
    </SessionProvider>
  )
}
