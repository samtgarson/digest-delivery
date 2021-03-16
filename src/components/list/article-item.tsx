import Link from "next/link"
import React, { FC } from "react"
import { Link as LinkIcon } from "react-feather"
import { Article } from "types/digest"
import { Anchor } from "../atoms/btn"
import cn from 'classnames'
import styles from 'src/styles/components/list.module.scss'

type ArticleItemProps = {
  data: Article
}

export const ArticleItem: FC<ArticleItemProps> = ({ data: { title, author, source, original_url } }) => {
  return <li className="mb-5 flex">
    <div className="mr-auto">
      <p className={ cn("font-bold", styles.countable) }>{ title }</p>
      { author
        ? <p>{ author } { source && <span>({ source })</span> }</p>
        : source && <p>{ source }</p>
      }
    </div>
    { original_url && <Link passHref href={original_url}>
      <Anchor target="_blank" naked small className="px-3"><LinkIcon /></Anchor>
    </Link>}
  </li>
}
