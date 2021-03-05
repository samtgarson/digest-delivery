import { ReactElement } from "react"
import { btnClasses } from "../btn"

type RadioListProps<KeyType extends string> = {
  value: string
  items: Record<string, KeyType>
  update: (val: KeyType) => void
}

const labelClasses = btnClasses(true, true, false, "font-thin checked:pointer-events-none cursor-pointer checked:font-bold checked:underline")

export function RadioList<K extends string> ({ items, update, value }: RadioListProps<K>): ReactElement<RadioListProps<K>> {
  return <div>{Object.entries<K>(items).map(([label, key]) => <span className="first:ml-0 ml-1" key={key}>
    <input
      id={`radio-${key}`}
      type="radio"
      checked={value == key}
      onChange={() => update(key)}
      className="sr-only"
    />
    <label className={labelClasses} htmlFor={`radio-${key}`}>{ label }</label>
  </span>)}</div>
}
