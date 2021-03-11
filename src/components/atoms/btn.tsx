import cn from 'classnames/bind'
import { forwardRef } from "react"
import styles from 'src/styles/components/btn.module.scss'

type BaseProps = { naked?: boolean, small?: boolean, secondary?: boolean, inverted?: boolean }
type BtnProps = BaseProps & React.ComponentPropsWithoutRef<'button'> & { type?: string }
type AnchorProps = BaseProps & React.ComponentPropsWithoutRef<'a'>

const cx = cn.bind(styles)

export const btnClasses = (props: BaseProps, classes?: string | string[]): string => cx(
  'button',
  props,
  classes
)

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ children, naked = false, small = false, secondary = false, inverted = false, className, ...attrs }, ref) => (
    <button {...attrs} className={btnClasses({ naked, small, secondary, inverted }, className)} ref={ref}>{ children }</button>
  )
)

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ children, naked = false, small = false, secondary = false, inverted = false, className, ...attrs }, ref) => (
    <a {...attrs} className={btnClasses({ naked, small, secondary, inverted }, className)} ref={ref}>{ children }</a>
  )
)

