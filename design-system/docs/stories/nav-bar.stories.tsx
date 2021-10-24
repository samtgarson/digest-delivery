import { Meta } from '@storybook/react'
import { Button, NavBar, NavBarProps } from '../..'

export default {
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    children: [
      <Button variant='naked'>About</Button>,
      <Button variant='primary'>Sign In</Button>
    ]
  }
} as Meta<NavBarProps>

export const Default = {}

export const SignedIn = {
  args: {
    children: [
      <Button variant='naked'>Dashboard</Button>,
      <Button variant='secondary'>Sign Out</Button>
    ]
  }
}
