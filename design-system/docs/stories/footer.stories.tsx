import { Meta } from '@storybook/react'
import { Button, Footer, FooterProps } from '../..'

export default {
  title: 'Furniture/Footer',
  component: Footer,
  render(props) {
    return (
      <Footer {...props}>
        <Button variant='inverted-secondary'>About</Button>
        <Button variant='naked-inverted'>Link 1</Button>
        <Button variant='naked-inverted'>Link 2</Button>
      </Footer>
    )
  }
} as Meta<FooterProps>

export const Default = {}
