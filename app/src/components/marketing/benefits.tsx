import { FC } from 'react'
import { Share2, Watch, Type } from 'react-feather'

const sections = [
  {
    Icon: Share2,
    title: 'Open integration',
    body: (
      <p>
        Integrate Feedly, Pocket, or any feed app using{' '}
        <strong>prebuilt integrations</strong> and an <strong>open API</strong>.
      </p>
    )
  },
  {
    Icon: Watch,
    title: 'On time delivery',
    body: (
      <p>
        Get your articles <strong>delivered on time</strong>, and on your
        schedule.
      </p>
    )
  },
  {
    Icon: Type,
    title: 'Beautifully formatted',
    body: (
      <p>
        Receive a <strong>real ebook</strong> to leverage all your
        Kindle&rsquo;s features like <strong>search and fonts</strong>.
      </p>
    )
  }
]

export const Benefits: FC = () => (
  <div className='lg:flex'>
    {sections.map(({ Icon, title, body }) => (
      <div key={title} className='lg:w-1/3 mb-4 mx-3 sm:mx-6'>
        <div className='flex items-center mb-3'>
          <div className='rounded bg-white p-4 inline-block mr-3 text-pink'>
            <Icon />
          </div>
          <h3 className='font-bold'>{title}</h3>
        </div>
        <div className='text-sm'>
          {body}
          <a className='font-bold underline block mt-3' href='#'>
            Read more
          </a>
        </div>
      </div>
    ))}
  </div>
)
