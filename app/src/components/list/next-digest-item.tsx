import { relativeDate } from '@digest-delivery/common/util'
import Link from 'next/link'
import { FC } from 'react'
import { ChevronRight, Loader } from 'react-feather'
import { Anchor } from '../atoms/btn'
import { articleCountLabel } from './digest-item'

const titleize = (str: string) => str[0].toUpperCase() + str.substring(1)

export const NextDigestItem: FC<{
  count: number
  delivery: Date
  active: boolean
}> = ({ count, delivery, active }) => (
  <div className='list-none bg-whiteFade'>
    <Link href={'/digests/next'}>
      <Anchor
        aria-label='View your next digest'
        naked
        small
        className='flex items-center p-3 w-full'
      >
        <span
          className='h-20 rounded bg-white text-pink mr-4 flex justify-center items-center'
          style={{ width: '3.125em' }}
        >
          <Loader className='hover:animate-spin' />
        </span>
        <div>
          <p className='font-bold'>
            {active
              ? titleize(relativeDate(delivery))
              : 'Not scheduled for delivery'}
          </p>
          <p className=''>
            {articleCountLabel(count)} {count === 0 && ' yet'}
          </p>
        </div>
        <span className='ml-auto'>
          <ChevronRight className='ml-3' />
        </span>
      </Anchor>
    </Link>
  </div>
)
