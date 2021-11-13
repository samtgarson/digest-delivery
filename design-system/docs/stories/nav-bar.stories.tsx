import { Meta } from '@storybook/react'
import { Button, NavBar, NavBarProps } from '../..'

export default {
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    children: [
      <NavBar.Item>
        <Button variant='naked'>About</Button>
      </NavBar.Item>,
      <NavBar.Item>
        <Button variant='primary'>Sign In</Button>
      </NavBar.Item>
    ]
  }
} as Meta<NavBarProps>

export const Default = {}

export const SignedIn = {
  args: {
    avatar:
      'https://pbs.twimg.com/profile_images/1119623988907520000/1qPAc0l3_400x400.jpg',
    children: [
      <NavBar.Item>
        <Button variant='naked'>Dashboard</Button>
      </NavBar.Item>,
      <NavBar.Item>
        <Button variant='naked'>Sign Out</Button>
      </NavBar.Item>
    ]
  }
}
