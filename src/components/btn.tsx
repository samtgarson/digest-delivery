import cn from 'classnames'
import { forwardRef } from "react"
import styles from '../styles/components/btn.module.scss'

type BaseProps = { naked?: boolean, small?: boolean, secondary?: boolean }
type BtnProps = BaseProps & React.ComponentPropsWithoutRef<'button'> & { type?: string }
type AnchorProps = BaseProps & React.ComponentPropsWithoutRef<'a'>

export const btnClasses = (
  naked: boolean,
  small: boolean,
  secondary: boolean,
  classes?: string | string[]
): string => cn([
  classes,
  styles.button,
  {
    [styles.naked]: naked,
    [styles.small]: small,
    [styles.secondary]: secondary
  }
])

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ children, naked = false, small = false, secondary = false, className, ...attrs }, ref) => (
    <button {...attrs} className={btnClasses(naked, small, secondary, className)} ref={ref}>{ children }</button>
  )
)

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ children, naked = false, small = false, secondary = false, className, ...attrs }, ref) => (
    <a {...attrs} className={btnClasses(naked, small, secondary, className)} ref={ref}>{ children }</a>
  )
)

