import { createClient } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import Head from 'next/head'
import getConfig from 'next/config'
import { useRouter } from 'next/dist/client/router'
import React, { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Nav } from 'src/components/atoms/nav'
import { useAuth } from 'src/lib/use-auth'
import { SupabaseContextProvider } from 'use-supabase'
import '../styles/global.css'

const { publicRuntimeConfig } = getConfig()
const supabase = createClient(publicRuntimeConfig.supabaseUrl, publicRuntimeConfig.supabaseKey)

const toastOptions = {
  style: {
    color: 'var(--blue)'
  }
}

const AppContent: FC = ({ children }) => {
  const router = useRouter()
  useAuth()

  return <>
    { router.route === '/' || <Nav hideLogo={router.pathname === '/'} /> }
    { children }
  </>
}

export default function CustomApp ({ Component, pageProps }: AppProps): ReactNode {
  return <div>
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
