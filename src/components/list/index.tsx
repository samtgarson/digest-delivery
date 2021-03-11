import { FC, HTMLAttributes, ReactElement } from "react"

interface Listable {
  id: string
}

type ListProps<Item> = HTMLAttributes<HTMLUListElement> & {
  data: Array<Item>
  item: FC<{ data: Item }>
}

export function List<Item extends Listable> ({ data, item: Item, ...attrs }: ListProps<Item>): ReactElement {
  return <ul {...attrs}>{ data.map(d => <Item data={d} key={d.id} />) }</ul>
}
