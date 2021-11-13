import cn from 'classnames'
import { ReactElement } from 'react'
import { Children, cloneElement, HTMLAttributes, VFC } from 'react'
import { Logo } from '../logo'
import styles from './styles.module.css'

export type FooterProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactElement[]
}

export const Footer: VFC<FooterProps> = ({ children, className, ...props }) => {
  const links = Children.map(children, child =>
    cloneElement(child, { className: styles.link })
  )

  return (
    <footer className={cn(styles.footer, className)} {...props}>
      <Logo big className={styles.logo} />
      <div className={cn(styles.linkWrapper)}>{links}</div>
    </footer>
  )
}
