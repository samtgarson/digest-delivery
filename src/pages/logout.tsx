import { NextPage } from "next"
import { useEffect } from "react"
import { useSupabase } from "use-supabase"


const Logout: NextPage = () => {
  const supabase = useSupabase()

  useEffect(() => {
    supabase.auth.signOut()
  }, [])

  return null
}

export default Logout
