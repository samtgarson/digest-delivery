import { Meta } from '@storybook/react'
import { Button, ButtonBaseProps, ButtonProps } from '../..'

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    variant: 'secondary',
    children: 'Digest Delivery'
  },
  render(props: ButtonBaseProps) {
    return (
      <div className={props.variant?.includes('inverted') ? 'bg-dark p-4' : ''}>
        <Button {...props} />
        <Button {...props} className='mx-2' disabled />
        <Button {...props} loading />
      </div>
    )
  }
} as Meta<ButtonProps>

export const Default = {}

export const Primary = { args: { variant: 'primary' } }

export const Outlined = {
  args: {
    variant: 'outlined'
  }
}

export const Accent = { args: { variant: 'accent' } }

export const Naked = { args: { variant: 'naked' } }

export const Inverted = { args: { variant: 'inverted' } }

export const InvertedSecondary = { args: { variant: 'inverted-secondary' } }
