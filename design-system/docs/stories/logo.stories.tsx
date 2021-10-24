import { Meta } from '@storybook/react'
import { Logo, LogoProps } from '../..'

export default {
  title: 'Components/Logo',
  component: Logo,
  render(props) {
    return <Logo className='h-32' {...props} />
  }
} as Meta<LogoProps>

export const Default = {}

export const Big = { args: { big: true } }
export const Small = { args: { small: true } }
