import { SVGAttributes, useMemo, VFC } from 'react'
import { ReactComponent as LogoBig } from '../../assets/logo-big.svg'
import { ReactComponent as LogoMark } from '../../assets/logo-mark.svg'
import { ReactComponent as LogoSmall } from '../../assets/logo-small.svg'

export type LogoVariants =
  | { big: true; small?: undefined }
  | { small: true; big?: undefined }
  | { big?: undefined; small?: undefined }

export type LogoProps = SVGAttributes<SVGElement> & LogoVariants

export const Logo: VFC<LogoProps> = ({ big, small, ...props }) => {
  const Component = useMemo(() => {
    if (big) return LogoBig
    if (small) return LogoSmall
    return LogoMark
  }, [big, small])

  return <Component {...props} title='Digest Delivery logo' />
}
