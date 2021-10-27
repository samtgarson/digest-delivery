import cn from 'classnames'
import { HTMLAttributes, VFC } from 'react'
import styles from './styles.module.css'

export type ContainerProps = {
  color?: 'bg' | 'default'
} & HTMLAttributes<HTMLElement>

export const Container: VFC<ContainerProps> = ({
  color = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <section
      className={cn(styles.section, className, styles[color])}
      {...props}
    >
      <div className={styles.container}>{children}</div>
    </section>
  )
}
