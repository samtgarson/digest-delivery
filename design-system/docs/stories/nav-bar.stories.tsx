import { Meta } from '@storybook/react'
import { Button, NavBar, NavBarProps, NavItem } from '../..'

export default {
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    children: [
      <NavItem>
        <Button variant='naked'>About</Button>
      </NavItem>,
      <NavItem>
        <Button variant='primary'>Sign In</Button>
      </NavItem>
    ]
  }
} as Meta<NavBarProps>

export const Default = {}

export const SignedIn = {
  args: {
    avatar:
      'https://pbs.twimg.com/profile_images/1119623988907520000/1qPAc0l3_400x400.jpg',
    children: [
      <NavItem>
        <Button variant='naked'>Dashboard</Button>
      </NavItem>,
      <NavItem>
        <Button variant='naked'>Sign Out</Button>
      </NavItem>
    ]
  }
}
