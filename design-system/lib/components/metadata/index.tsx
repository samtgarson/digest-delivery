import cn from 'classnames'
import { HTMLAttributes, ReactNode, VFC } from 'react'
import styles from './styles.module.css'

export type MetaDataProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  data: Record<string, ReactNode>
}

export const MetaData: VFC<MetaDataProps> = ({ data, className, ...props }) => {
  return (
    <table {...props} className={cn(styles.table, className)}>
      {Object.entries(data).map(([key, val]) => (
        <tr>
          <td className={styles.key}>{key}</td>
          <td className={styles.val}>{val}</td>
        </tr>
      ))}
    </table>
  )
}
