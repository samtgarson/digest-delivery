import Dialog from '@reach/dialog'
import { useRouter } from 'next/router'
import { FC } from 'react'
import styles from 'src/styles/components/modal.module.scss'
import cn from 'classnames'
import { Anchor } from './atoms/btn'

const zapierUrl =
  'https://zapier.com/developer/public-invite/128330/3e551193e3057faa1eda954fb6c35617/'

const IntegrationHelp: FC = () => {
  const router = useRouter()

  return (
    <Dialog
      aria-labelledby='integration-help-title'
      className={cn(styles.modal, 'w-4/5 max-w-2xl')}
      isOpen={
        router.query.params
          ? router.query.params[0] === 'integration-help'
          : false
      }
      onDismiss={() => router.push('/dashboard', undefined, { shallow: true })}
    >
      <h2 id='integration-help-title' className='subtitle'>
        Setup an Integration
      </h2>
      <p>
        To start sending articles to your digest, set up a Zapier integration
        with your favourite reader or aggregator.
      </p>
      <p className='my-3'>
        Use the <strong>Add Article</strong> trigger to send articles to your
        digest.
      </p>
      <Anchor inverted className='my-4' href={zapierUrl} target='_blank'>
        Integrate with Zapier
      </Anchor>
      <p className='mt-4'>
        Stuck?{' '}
        <a href='mailto:sam@digest.delivery' className='underline'>
          Get in touch
        </a>
      </p>
    </Dialog>
  )
}

export default IntegrationHelp
