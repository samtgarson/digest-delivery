import cn from 'classnames'
import { HTMLAttributes, ReactNode, VFC } from 'react'
import { Logo } from '../logo'
import styles from './styles.module.css'

export type NavBarProps = HTMLAttributes<HTMLElement> & {
  avatar?: string
  children?: ReactNode
}

type NavBar = VFC<NavBarProps> & {
  Item: VFC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>>
}

export const NavBar: NavBar = ({ avatar, className, children, ...props }) => {
  return (
    <nav {...props} className={cn(className, styles.nav)}>
      <a className={styles.logo}>
        <Logo small />
      </a>
      {children}
      {avatar && (
        <NavBar.Item>
          <img src={avatar} className={styles.avatar} />
        </NavBar.Item>
      )}
    </nav>
  )
}

NavBar.Item = ({ children, className, ...props }) => (
  <div className={cn(className, styles.navItem)} {...props}>
    {children}
  </div>
)
