import cn from 'classnames'
import { VFC } from 'react'
import twConfig from '../../tailwind.config'

export const TypographyDocs: VFC = () => {
  return (
    <table className='w-full table-fixed'>
      <tr>
        <td className='p-3 w-32 opacity-6 text-sm'>
          <code>.caption</code>
        </td>
        <td className='p-3'>
          <p className='caption'>Caption</p>
        </td>
      </tr>
      {Object.entries(twConfig.theme.fontSize).map(
        ([cls, [fontSize, lineHeight]]) => (
          <tr key={cls}>
            <td className='p-3 opacity-6 text-sm'>
              <code>.text-{cls}</code>
            </td>
            <td className={cn('p-3')}>
              <p style={{ fontSize, lineHeight }}>Body</p>
            </td>
          </tr>
        )
      )}
    </table>
  )
}
