import { useDebounceCallback } from '@react-hook/debounce'
import cn from 'classnames'
import { FC, HTMLAttributes, useEffect, useState } from "react"

type TextInputProps = {
  value: string | null
  update: (val: string | null) => void
}

const inputClasses = 'underline rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue font-bold bg-whiteFade placeholder-blue placeholder-opacity-50 placeholder-shown:no-underline'

export const TextInput: FC<HTMLAttributes<HTMLInputElement> & TextInputProps> = ({ value, update, className, ...attrs }) => {
  const [val, setVal] = useState<string | null>(value)

  const santisedUpdate = () => val != value && update(val === '' ? null : val)
  const debouncedUpdate = useDebounceCallback(santisedUpdate, 1000)
  useEffect(debouncedUpdate, [val])

  return <input type="email" value={val || ''} onChange={e => setVal(e.target.value)} { ...attrs } className={cn(className, inputClasses)} />
}
