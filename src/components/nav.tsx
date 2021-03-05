import { useSupabase, useUser } from "use-supabase"
import Link from 'next/link'
import React, { FC, useCallback } from "react"
import { PageWrapper } from "./page-wrapper"
import { Anchor, Btn } from "./btn"

type NavProps = {
  hideLogo: boolean
}

export const Nav: FC<NavProps> = () => {
  const user = useUser()
  const supabase = useSupabase()

  const signOut = useCallback(() => {
    supabase.auth.signOut()
  }, [])

  return <nav className="px-3 py-3 flex justify-between mb-6">
    <Link href="/app" passHref>
    <Anchor naked small className="uppercase">Digest Delivery</Anchor>
    </Link>
    { user &&
      <Btn naked small onClick={signOut} className="flex items-center">
    Sign Out
    <img className="h-7 rounded-sm ml-3" src={user?.user_metadata.avatar_url} />
    </Btn>
    }
  </nav>
}
