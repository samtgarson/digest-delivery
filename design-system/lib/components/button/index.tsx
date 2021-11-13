import cn from 'classnames/bind'
import { forwardRef, useMemo } from 'react'
import styles from './styles.module.css'

const cx = cn.bind(styles)

type excludedNativeAttrs = 'children' | 'onClick'
type ButtonTagProps = Omit<
  JSX.IntrinsicElements['button'],
  excludedNativeAttrs
> & {
  href?: undefined
} & ButtonBaseProps

type AnchorTagProps = Omit<JSX.IntrinsicElements['a'], excludedNativeAttrs> & {
  href: string
} & ButtonBaseProps

export type ButtonBaseProps = {
  children: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'naked'
    | 'naked-inverted'
    | 'accent'
    | 'inverted'
    | 'inverted-secondary'
    | 'outlined'
  disabled?: boolean
  loading?: boolean
  onClick?(): void
}

export type ButtonProps = ButtonTagProps | AnchorTagProps

type PolymorphicButton = {
  (props: AnchorTagProps): JSX.Element
  (props: ButtonTagProps): JSX.Element
}

const isAnchor = (props: ButtonProps): props is AnchorTagProps => {
  return props.href !== undefined
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    className,
    variant = 'secondary',
    disabled,
    loading,
    ...restProps
  } = props
  const classNames = useMemo(() => {
    const dark = ['inverted-secondary', 'primary', 'naked-inverted'].includes(
      variant
    )
    return cx('button', variant, className, {
      loading,
      disabled,
      spinner: loading && !dark,
      'spinner-dark': loading && dark
    })
  }, [loading, variant, disabled])

  return isAnchor(props) ? (
    <a
      className={classNames}
      {...(restProps as AnchorTagProps)}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      aria-disabled={disabled || loading}
    />
  ) : (
    <button
      type='button'
      disabled={disabled || loading}
      className={classNames}
      {...(restProps as ButtonTagProps)}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
    />
  )
}) as PolymorphicButton
