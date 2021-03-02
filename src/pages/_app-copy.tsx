import { createClient } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import { useRouter } from 'next/dist/client/router'
import { ReactNode } from 'react'
import { Nav } from 'src/components/nav'
import { SupabaseContextProvider } from 'use-supabase'
import '../styles/global.scss'

const { publicRuntimeConfig } = getConfig()
const supabase = createClient(publicRuntimeConfig.supabaseUrl, publicRuntimeConfig.supabaseKey)

export default function CustomApp ({ Component, pageProps }: AppProps): ReactNode {
  const router = useRouter()

  return <SupabaseContextProvider client={supabase}>
    <Nav hideLogo={router.pathname === '/'} />
    <Component {...pageProps} />
  </SupabaseContextProvider>
}

CustomApp.getInitialProps = async (appContext: AppContext) => {

}
