import cn from 'classnames'
import { HTMLAttributes, ReactNode, VFC } from 'react'
import { Logo } from '../logo'
import styles from './styles.module.css'

export type NavBarProps = HTMLAttributes<HTMLElement> & {
  avatar?: string
  children?: ReactNode
}

export const NavItem: VFC<
  { children: ReactNode } & HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => (
  <div className={cn(className, styles.navItem)} {...props}>
    {children}
  </div>
)

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
      {avatar && (
        <NavItem>
          <img src={avatar} className={styles.avatar} />
        </NavItem>
      )}
    </nav>
  )
}
