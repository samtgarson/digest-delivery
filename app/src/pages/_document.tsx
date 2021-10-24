import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render (): JSX.Element {
    return (
      <Html>
        <Head />
        <body id="main">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
