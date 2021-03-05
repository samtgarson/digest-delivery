import cn from 'classnames'
import { FC } from "react"

export const PageWrapper: FC<{ className?: string }> = ({ children, className }) => {
  return <main className={ cn([className, "max-w-2xl px-3 py-3 mx-auto"]) }>
    { children }
  </main>
}
