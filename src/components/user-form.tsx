import { Frequency, User } from 'types/digest'
import React, { FC, useState } from 'react'
import { CheckCircle, XCircle } from 'react-feather'
import { Btn } from './btn'
import { Form } from './form'
import { FieldSet } from './form/field-set'
import { RadioList } from './form/radio-list'
import { TextInput } from './form/text-input'
import { ApiKeyModal } from './api-key-modal'

type UserFormProps = {
  user: User
  updateUser: (payload: Partial<User>) => void
}

const ActiveButton: FC<UserFormProps> = ({ updateUser, user: { active } }) => {
  const Icon = active ? CheckCircle : XCircle
  return <>
    <p className='flex items-center mb-3 sm:mb-0'><Icon className='inline-block mr-2' /> Your digest is { active ? 'active' : 'inactive' }</p>
  <Btn type='button' secondary={active} onClick={() => updateUser({ active: !active }) }>
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
  <RadioList value={frequency} items={items} update={frequency => updateUser({ frequency })} className="text-right flex-grow" />
</>

const AddressField: FC<UserFormProps> = ({ updateUser, user: { kindle_address: address } }) => <>
  <p className='mb-3 sm:mb-0'>Your Send to Kindle email is</p>
  <TextInput value={address} update={kindle_address => updateUser({ kindle_address })} className='w-full sm:w-60' />
</>

const ApiKeyRegen: FC = () => {
  const [confirm, setConfirm] = useState(false)
  const close = () => setConfirm(false)

  return <>
    <p className='mb-3 sm:mb-0'>Your API Key</p>
    <Btn type="button" onClick={() => setConfirm(true)} secondary>Generate an API Key</Btn>
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
