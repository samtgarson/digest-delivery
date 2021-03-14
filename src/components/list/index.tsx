import { FC, HTMLAttributes, ReactElement } from "react"
import cn from 'classnames'
import styles from 'src/styles/components/list.module.scss'

interface Listable {
  id: string
}

type ListProps<Item> = HTMLAttributes<HTMLUListElement> & {
  data: Array<Item>
  item: FC<{ data: Item }>
  ordered?: boolean
}

export function List<Item extends Listable> ({ data, item: Item, ordered = false, className, ...attrs }: ListProps<Item>): ReactElement {
  const Tag = ordered ? 'ol' : 'ul'
  const listClass = ordered ? styles.orderedList : null
  return <Tag {...attrs} className={ cn(listClass, className) }>{ data.map(d => <Item data={d} key={d.id} />) }</Tag>
}
