import cn from 'classnames'
import { decode } from 'html-entities'
import Link from 'next/link'
import { FC } from 'react'
import { Link as LinkIcon } from 'react-feather'
import styles from 'src/styles/components/list.module.scss'
import { Article } from 'types/digest'
import { Anchor } from '../atoms/btn'

type ArticleItemProps = {
  data: Article
}

export const ArticleItem: FC<ArticleItemProps> = ({
  data: { title, author, source, originalUrl }
}) => {
  return (
    <li className='mb-8 relative'>
      <h4 className={cn('font-bold text-lg', styles.countable)}>
        {decode(title)}
      </h4>
      {author ? (
        <p>
          {decode(author)} {source && <span>({source})</span>}
        </p>
      ) : (
        source && <p>{source}</p>
      )}
      {originalUrl && (
        <Link passHref href={originalUrl}>
          <Anchor
            target='_blank'
            naked
            small
            className='px-3 absolute right-0 top-6 transform -translate-y-2/4 h-12 bg-green'
          >
            <LinkIcon />
            <span className='ml-2 overflow-hidden w-0 link-hover:w-36 transition-all whitespace-nowrap'>
              Read original article
            </span>
          </Anchor>
        </Link>
      )}
    </li>
  )
}
