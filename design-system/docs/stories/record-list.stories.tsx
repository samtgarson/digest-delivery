import { Meta } from '@storybook/react'
import { Button, RecordList, RecordListProps } from '../..'

const items = ['Title 1', 'Title 2', 'Title 3', 'Title 4']

export default {
  title: 'Components/RecordList',
  component: RecordList,
  render() {
    return (
      <div className='bg-bg p-3'>
        <RecordList>
          {items.map(title => (
            <RecordList.Item key={title}>
              <span className='text-xl font-bold mr-3'>{title}</span>9 articles
              <Button variant='naked' className='sm:ml-auto mt-2 sm:mt-0'>
                View Digest
              </Button>
            </RecordList.Item>
          ))}
        </RecordList>
      </div>
    )
  }
} as Meta<RecordListProps>

export const Default = {}
