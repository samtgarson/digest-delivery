import { AppProps } from 'next/app'
import '../styles/global.scss'

// This default export is required in a new `pages/_app.js` file.
export default function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
