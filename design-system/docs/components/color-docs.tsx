import cn from 'classnames'
import tailwind from '../../tailwind.config'

export const ColorDocs: React.VFC = () => {
  const colors = Object.entries(tailwind.theme.colors).map(
    ([name, backgroundColor]) => (
      <li
        key={name}
        className={cn('mx-1 w-full h-24 rounded-md border-dark mb-6 shadow', {
          border: name.includes('white')
        })}
        style={{ backgroundColor }}
      >
        <pre className='px-1 m-1 rounded bg-white inline-block'>{name}</pre>
      </li>
    )
  )

  return <ul className='flex flex-col'>{colors}</ul>
}
