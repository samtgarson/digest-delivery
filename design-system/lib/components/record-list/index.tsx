import cn from 'classnames'
import { HTMLAttributes, VFC } from 'react'
import { Card } from '../card'
import styles from './styles.module.css'

export type RecordListProps = HTMLAttributes<HTMLUListElement>
export type RecordListItemProps = HTMLAttributes<HTMLLIElement>

type RecordList = VFC<RecordListProps> & {
  Item: VFC<RecordListItemProps>
}

export const RecordList: RecordList = ({ className, children, ...props }) => {
  return (
    <ul {...props} className={cn(styles.list, className)}>
      {children}
    </ul>
  )
}

RecordList.Item = ({ className, children }) => {
  return (
    <li className={cn(className, styles.item)}>
      <Card className={styles.card}>{children}</Card>
    </li>
  )
}
