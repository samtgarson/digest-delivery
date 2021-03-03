import { FC } from "react"

export const PageWrapper: FC<{ tag?: keyof JSX.IntrinsicElements }> = ({ tag, children }) => {
  const Tag = tag ?? 'main'
  return <Tag className="max-w-4xl px-3 py-3 mx-auto flex justify-between">
    { children }
  </Tag>
}
