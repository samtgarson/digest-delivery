import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"
import { useSupabase } from "use-supabase"
import { toast } from 'react-hot-toast'
import { AuthChangeEvent, Session } from "@supabase/supabase-js"

export const reauth = (): void => {
  toast('Please login again')
  location.assign(`/login?redirect=${location.pathname}${location.search}`)
}

export const setSession = (event: AuthChangeEvent, session: Session | null): Promise<Response> => fetch('/api/auth', {
  method: 'POST',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  credentials: 'same-origin',
  body: JSON.stringify({ event, session })
})


export const useAuth = (): void => {
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const existingSesssion = supabase.auth.session()
    if (existingSesssion) setSession('SIGNED_IN', existingSesssion)

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_OUT') router.push('/')
      setSession(event, session)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])
}
