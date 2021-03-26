import cn from 'classnames/bind'
import { ComponentProps, forwardRef } from "react"
import styles from 'src/styles/components/btn.module.scss'

type BaseProps = {
  naked?: boolean
  small?: boolean
  secondary?: boolean
  outlined?: boolean
  inverted?: boolean
}

const cx = cn.bind(styles)

export const btnClasses = (props: BaseProps, classes?: string | string[]): string => cx(
  'button',
  props,
  classes
)


export const Anchor = forwardRef<HTMLAnchorElement, BaseProps & ComponentProps<'a'>>(({
  naked, small, secondary, outlined, inverted, children, className, ...attrs
}, ref) =>
  <a
    {...attrs}
    className={btnClasses({ naked, small, secondary, outlined, inverted }, className)}
    ref={ref}
  >{ children }</a>
)

export const Btn = forwardRef<HTMLButtonElement, BaseProps & ComponentProps<'button'>>(({
  naked, small, secondary, outlined, inverted, children, className, ...attrs
}, ref) =>
  <button
    {...attrs}
    className={btnClasses({ naked, small, secondary, outlined, inverted }, className)}
    ref={ref}
  >{ children }</button>
)

