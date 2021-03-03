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

  return <PageWrapper tag="nav">
    <Link href="/app" passHref>
      <Anchor naked small className="uppercase">Digest Delivery</Anchor>
    </Link>
    { user &&
      <Btn naked small onClick={signOut} className="flex items-center text-sm">
        Sign Out
        <img className="h-6 rounded-sm ml-2" src={user?.user_metadata.avatar_url} />
      </Btn>
    }
  </PageWrapper>
}
