import { createClient } from '@supabase/supabase-js'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import { useRouter } from 'next/dist/client/router'
import { FC, ReactNode } from 'react'
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
  return <SupabaseContextProvider client={supabase}>
    <AppContent>
      <Component {...pageProps} />
    </AppContent>
    <Toaster toastOptions={toastOptions} />
  </SupabaseContextProvider>
}
