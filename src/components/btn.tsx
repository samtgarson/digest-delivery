import { forwardRef } from "react"
import styles from '../styles/components/btn.module.scss'

type BaseProps = { naked?: boolean, small?: boolean }
type BtnProps = BaseProps & React.ComponentPropsWithoutRef<'button'>
type AnchorProps = BaseProps & React.ComponentPropsWithoutRef<'a'>

const classNames = (classes = '', naked: boolean, small: boolean) => [
  classes,
  styles.button,
  naked && styles.naked,
  small && styles.small
].join(' ')

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(({ children, naked = false, small = false, className, ...attrs }, ref) => (
  <button {...attrs} className={classNames(className, naked, small)} ref={ref}>{ children }</button>
))

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ children, naked = false, small = false, className, ...attrs }, ref) => (
  <a {...attrs} className={classNames(className, naked, small)} ref={ref}>{ children }</a>
))

