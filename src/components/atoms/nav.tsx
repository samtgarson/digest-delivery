import Link from 'next/link'
import React, { FC } from "react"
import { useUser } from "use-supabase"
import { Anchor } from "./btn"
import { Icon } from './icon'

const NavLink: FC<{ href: string }> = ({ children, href }) => (
  <Link passHref href={ href }>
    <Anchor naked small className="flex items-center font-bold ml-3">
      { children }
    </Anchor>
  </Link>
)

export const Nav: FC = () => {
  const user = useUser()
  const homeLink = user ? '/dashboard' : '/'

  return <nav className="px-3 py-3 flex justify-between mb-6">
    <Link href={homeLink} passHref>
      <Anchor naked small className="uppercase font-bold mr-auto">
        <Icon height="1em" className="mr-3" />
        <span className="hidden sm:inline-block">Digest Delivery</span>
      </Anchor>
    </Link>
    { user
      ? <NavLink href="/logout">
          Sign Out
          <img className="h-7 rounded-sm ml-3" src={user?.user_metadata.avatar_url} />
      </NavLink>
      : <>
        <NavLink href="/#about">About</NavLink>
        <NavLink href="login">Sign In</NavLink>
      </>
    }
  </nav>
}
