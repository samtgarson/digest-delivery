import { Meta } from '@storybook/react'
import { Card, CardProps } from '../..'

export default {
  title: 'Components/Card',
  component: Card,
  args: {
    children: 'Digest Delivery'
  },
  render: props => (
    <div className='bg-bg p-4'>
      <Card {...props} />
    </div>
  )
} as Meta<CardProps>

export const Default = {}

export const Dark = { args: { dark: true } }

export const Big = { args: { big: true } }

export const BigDark = { args: { big: true, dark: true } }
