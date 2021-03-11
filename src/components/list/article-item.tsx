import Link from "next/link"
import React, { FC } from "react"
import { Link as LinkIcon } from "react-feather"
import { Article } from "types/digest"
import { Anchor } from "../atoms/btn"

type ArticleItemProps = {
  data: Article
}

export const ArticleItem: FC<ArticleItemProps> = ({ data: { title, author, source, original_url } }) => {
  const credit = [author, source].filter(t => !!t).join(', from ')

  return <li className="list-none mb-3 p-2 flex">
    <div className="mr-auto">
      <p className="font-bold">{ title }</p>
      <p>{ credit }</p>
    </div>
    { original_url && <Link passHref href={original_url}>
      <Anchor target="_blank" naked small className="px-3"><LinkIcon /></Anchor>
    </Link>}
  </li>
}
