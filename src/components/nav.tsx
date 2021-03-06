import Link from 'next/link'
import React, { FC } from "react"
import { useUser } from "use-supabase"
import { Anchor, Btn } from "./btn"

type NavProps = {
  hideLogo: boolean
}

export const Nav: FC<NavProps> = () => {
  const user = useUser()

  return <nav className="px-3 py-3 flex justify-between mb-6">
    <Link href="/dashboard" passHref>
    <Anchor naked small className="uppercase">Digest Delivery</Anchor>
    </Link>
    { user && <Link passHref href="/logout">
      <Btn naked small className="flex items-center">
        Sign Out
        <img className="h-7 rounded-sm ml-3" src={user?.user_metadata.avatar_url} />
      </Btn>
    </Link> }
  </nav>
}
