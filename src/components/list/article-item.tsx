import Link from "next/link"
import React, { FC } from "react"
import { Link as LinkIcon } from "react-feather"
import { Article } from "types/digest"
import { Anchor } from "../atoms/btn"
import cn from 'classnames'
import styles from 'src/styles/components/list.module.scss'
import { decode } from "html-entities"

type ArticleItemProps = {
  data: Article
}

export const ArticleItem: FC<ArticleItemProps> = ({ data: { title, author, source, original_url } }) => {
  return <li className="mb-5 flex">
    <div className="mr-auto">
      <h4 className={ cn("font-bold text-lg", styles.countable) }>{ decode(title) }</h4>
      { author
        ? <p>{ decode(author) } { source && <span>({ source })</span> }</p>
        : source && <p>{ source }</p>
      }
    </div>
    { original_url && <Link passHref href={original_url}>
      <Anchor target="_blank" naked small className="px-3">
        <LinkIcon />
        <span className="ml-2 overflow-hidden w-0 link-hover:w-36 transition-all whitespace-nowrap">Read original article</span>
      </Anchor>
    </Link>}
  </li>
}
