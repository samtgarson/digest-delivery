import { createClient, Session } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import Head from 'next/head'
import { NextRouter, useRouter } from 'next/router'
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

const setSessionAndRedirect = async (session: Session, router: NextRouter) => {
  await setSession('SIGNED_IN', session)
  const params = new URLSearchParams(location.search)
  const redirect = params.get('redirect')
  console.log({ redirect })
  if (redirect) router.replace(redirect)
}

const AppContent: FC = ({ children }) => {
  useAuth()
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const session = supabase.auth.session()
    console.log({ session })
    if (session) setSessionAndRedirect(session, router)
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
