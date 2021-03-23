import { createClient, Session } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import Head from 'next/head'
import React, { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Nav } from 'src/components/atoms/nav'
import { setSession, useAuth } from 'src/lib/use-auth'
import { SupabaseContextProvider, useSupabase } from 'use-supabase'
import '../styles/global.css'
import FiveHundred from './500'

const { publicRuntimeConfig } = getConfig()
const supabase = createClient(publicRuntimeConfig.supabaseUrl, publicRuntimeConfig.supabaseKey)

const toastOptions = {
  style: {
    color: 'var(--blue)'
  }
}

const setSessionAndRedirect = async (session: Session) => {
  await setSession('SIGNED_IN', session)
  const params = new URLSearchParams(location.search)
  const redirect = params.get('redirect')
  redirect && location.assign(redirect)
}

const AppContent: FC = ({ children }) => {
  useAuth()
  const supabase = useSupabase()
  useEffect(() => {
    const session = supabase.auth.session()
    if (session) setSessionAndRedirect(session)
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
          ? <FiveHundred />
          : <Component {...pageProps} />
        }
      </AppContent>
      <Toaster toastOptions={toastOptions} />
    </SupabaseContextProvider>
  </div>
}
