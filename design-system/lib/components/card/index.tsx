import cn from 'classnames/bind'
import { forwardRef, HTMLAttributes } from 'react'
import styles from './styles.module.css'

const cx = cn.bind(styles)

export type CardProps = {
  dark?: boolean
  big?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, dark, big, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(className, 'card', { dark, big })}
      >
        {children}
      </div>
    )
  }
)
