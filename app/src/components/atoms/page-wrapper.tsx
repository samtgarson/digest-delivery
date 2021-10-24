import cn from 'classnames'
import Head from 'next/head'
import { FC } from 'react'

export const PageWrapper: FC<{ className?: string, title?: string }> = ({
  children,
  title,
  className
}) => {
  return (
    <main className={cn([className, 'max-w-2xl px-3 py-3 mx-auto mb-28'])}>
      {title && (
        <Head>
          <title>{title} | Digest Delivery</title>
        </Head>
      )}
      {children}
    </main>
  )
}
