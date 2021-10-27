import { Container } from '../..'

export default {
  title: 'Components/Container',
  component: Container,
  args: {
    children: (
      <>
        <h1>Content goes here</h1>
        <p>That's right, you heard me</p>
      </>
    )
  }
}

export const Default = {}

export const WithBg = {
  args: {
    color: 'bg'
  }
}
