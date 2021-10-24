import { FC, HTMLAttributes } from 'react'
import cn from 'classnames'

export const FieldSet: FC<
  { highlight?: boolean } & HTMLAttributes<HTMLFieldSetElement>
> = ({ children, highlight, className, ...attrs }) => (
  <fieldset
    {...attrs}
    className={cn(
      'mb-6 last:mb-0 sm:flex justify-between items-center',
      { 'text-xl mb-14': highlight },
      className
    )}
  >
    {children}
  </fieldset>
)
