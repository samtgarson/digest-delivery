import Link from 'next/link'
import { FC, useState } from 'react'
import { CheckCircle, HelpCircle, RefreshCw, XCircle } from 'react-feather'
import { Frequency, User } from 'types/digest'
import { ApiKeyModal } from './api-key-modal'
import { Btn } from './atoms/btn'
import { Form } from './form'
import { FieldSet } from './form/field-set'
import { RadioList } from './form/radio-list'
import { TextInput } from './form/text-input'

type UserFormProps = {
  user: User
  updateUser: (payload: Partial<User>) => void
}

const ActiveButton: FC<UserFormProps> = ({ updateUser, user: { active } }) => {
  const Icon = active ? CheckCircle : XCircle
  return <>
    <p className='flex items-center mb-3 sm:mb-0'><Icon className='inline-block mr-2' /> Your digest is { active ? 'active' : 'inactive' }</p>
  <Btn type='button' className="sm:w-60" secondary={active} onClick={() => updateUser({ active: !active }) }>
    { active ? 'Deactivate' : 'Activate' }
  </Btn>
  </>
}


const items = {
  Daily: Frequency.Daily,
  Weekly: Frequency.Weekly
}
const FrequencyToggle: FC<UserFormProps> = ({ updateUser, user: { frequency } }) => <>
  <p className='mb-3 sm:mb-0'>Your digest is delivered</p>
  <RadioList value={frequency} items={items} update={frequency => updateUser({ frequency })} className="sm:text-right flex-grow" />
</>

const AddressField: FC<UserFormProps> = ({ updateUser, user: { kindleAddress: address } }) => <>
  <label htmlFor="kindle-address-input" className='mb-3 sm:mb-0'>Your Send to Kindle email is</label>
  <TextInput id="kindle-address-input" placeholder="bob@kindle.com" value={address} update={kindleAddress => updateUser({ kindleAddress })} className='w-full sm:w-60' />
</>

const ApiKeyRegen: FC = () => {
  const [confirm, setConfirm] = useState(false)
  const close = () => setConfirm(false)

  return <>
    <p className='mb-3 sm:mb-0'>Your API Key
      <Link href="/dashboard/integration-help" shallow>
        <a><HelpCircle className="inline-block ml-2 mb-1" height="0.95rem" /></a>
      </Link>
    </p>
    <Btn type="button" onClick={() => setConfirm(true)} secondary className="sm:w-60"><RefreshCw height="1em" className="mr-3" />Generate an API Key</Btn>
    <ApiKeyModal open={confirm} close={close} />
  </>
}

export const UserForm: FC<UserFormProps> = ({ user, updateUser }) => {
  return <Form>
    <FieldSet highlight>
      <ActiveButton user={user} updateUser={updateUser} />
    </FieldSet>
    <FieldSet>
      <FrequencyToggle user={user} updateUser={updateUser} />
    </FieldSet>
    <FieldSet>
      <AddressField user={user} updateUser={updateUser} />
    </FieldSet>
    <FieldSet>
      <ApiKeyRegen />
    </FieldSet>
  </Form>
}
