import { createClient } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import Head from 'next/head'
import React, { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Nav } from 'src/components/atoms/nav'
import { setSession, useAuth } from 'src/lib/use-auth'
import { SupabaseContextProvider, useSupabase } from 'use-supabase'
import '../styles/global.css'

const { publicRuntimeConfig } = getConfig()
const supabase = createClient(publicRuntimeConfig.supabaseUrl, publicRuntimeConfig.supabaseKey)

const toastOptions = {
  style: {
    color: 'var(--blue)'
  }
}

const AppContent: FC = ({ children }) => {
  useAuth()
  const supabase = useSupabase()
  useEffect(() => {
    const session = supabase.auth.session()
    if (session) {
      setSession('SIGNED_IN', session)
      const params = new URLSearchParams(location.search)
      const redirect = params.get('redirect')
      redirect && location.assign(redirect)
    }
  }, [])


  return <>
    <Nav />
    { children }
  </>
}

export default function CustomApp ({ Component, pageProps }: AppProps): ReactNode {
  return <div>
    <Head>
      <title>Digest Delivery</title>
    </Head>
    <SupabaseContextProvider client={supabase}>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <AppContent>
        { pageProps._error
          ? <p>{ pageProps._error.message }</p>
          : <Component {...pageProps} />
        }
      </AppContent>
      <Toaster toastOptions={toastOptions} />
    </SupabaseContextProvider>
  </div>
}
