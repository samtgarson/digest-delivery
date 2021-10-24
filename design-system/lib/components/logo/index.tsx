import { HTMLAttributes, useMemo, VFC } from 'react'
import logoBig from '../../assets/logo-big.svg'
import logoMark from '../../assets/logo-mark.svg'
import logoSmall from '../../assets/logo-small.svg'

export type LogoVariants =
  | { big: true, small?: undefined }
  | { small: true, big?: undefined }
  | { big?: undefined, small?: undefined }

export type LogoProps = HTMLAttributes<HTMLImageElement> & LogoVariants

export const Logo: VFC<LogoProps> = ({ big, small, ...props }) => {
  const src = useMemo(() => {
    if (big) return logoBig
    if (small) return logoSmall
    return logoMark
  }, [big, small])

  return <img src={src} {...props} />
}
