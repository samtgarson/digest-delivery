import { useSupabase, useUser } from "use-supabase"
import Link from 'next/link'
import { FC, useCallback } from "react"
import styles from '../styles/components/nav.module.scss'

type NavProps = {
  hideLogo: boolean
}

export const Nav: FC<NavProps> = () => {
  const user = useUser()
  const supabase = useSupabase()

  const signOut = useCallback(() => {
    supabase.auth.signOut()
  }, [])

  return <nav className={styles.nav}>
    <Link href="/app">
      <a className={styles.logo}>Digest Delivery</a>
    </Link>
    { user &&
      <span className={styles.name}>
        <button onClick={signOut}>Sign Out</button>
        <img className={styles.avatar} src={user?.user_metadata.avatar_url} />
      </span>
    }
  </nav>
}
