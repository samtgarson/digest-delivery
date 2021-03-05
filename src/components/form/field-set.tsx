import { FC } from "react"
import cn from 'classnames'

export const FieldSet: FC<{ highlight?: boolean }> = ({ children, highlight }) =>
  <fieldset className={
    cn("mb-6 sm:flex justify-between items-center", { "bg-whiteFade rounded-xl px-7 py-6 -mx-7 text-lg": highlight })
  }>{ children }</fieldset>
