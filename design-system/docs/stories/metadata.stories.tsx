import { Meta } from '@storybook/react'
import { MetaData, MetaDataProps } from '../..'

export default {
  title: 'Components/MetaData',
  component: MetaData,
  args: {
    data: {
      Schedule: 'Weekly',
      Sources: '3 sources',
      Status: (
        <>
          Active<span className='ml-1'>✅</span>
        </>
      )
    }
  }
} as Meta<MetaDataProps>

export const Default = {}
