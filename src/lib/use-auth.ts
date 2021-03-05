import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"
import { useSupabase } from "use-supabase"

export const useAuth = (): void => {
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_OUT') router.push('/')

      fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session })
      })
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])
}
