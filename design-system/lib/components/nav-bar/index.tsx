import cn from 'classnames'
import { HTMLAttributes, ReactNode, VFC } from 'react'
import { Logo } from '../logo'
import styles from './styles.module.css'

export type NavBarProps = HTMLAttributes<HTMLElement> & {
  avatar?: string
  children?: ReactNode
}

export const NavBar: VFC<NavBarProps> = ({
  avatar,
  className,
  children,
  ...props
}) => {
  return (
    <nav {...props} className={cn(className, styles.nav)}>
      <a className={styles.logo}>
        <Logo small />
      </a>
      {children}
    </nav>
  )
}
