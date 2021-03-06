import React, { FC, useState, useCallback } from "react"
import { Dialog } from "@reach/dialog"
import { toast } from 'react-hot-toast'
import "@reach/dialog/styles.css"
import { Btn } from "./btn"
import { useAuth } from "src/lib/use-auth"

export const ApiKeyModal: FC<{ open: boolean, close: () => void }> = ({ open, close }) => {
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState<string>()
  const { reauth } = useAuth()

  const run = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/api-keys', { method: 'POST', credentials: 'same-origin' })

    if (!res.ok) {
      if (res.status === 401) return reauth()
      toast('Something went wrong, try again soon.')
      return close()
    }

    const { id } = await res.json()
    setKey(id)
    setLoading(false)
  }, [open])

  const done = () => {
    setKey(undefined)
    close()
  }

  return <Dialog className="rounded-sm text-center" isOpen={open} onDismiss={close}>
    { loading
      ? <p>Crunching numbers...</p>
      : key
        ? <>
          <p>Your API Key is</p>
          <p className="font-bold underline mb-7 mt-3">{ key }</p>
          <p>Keep it somewhere safe, we can't show it again!</p>
          <Btn inverted className="mt-4" onClick={done}>Got it</Btn>
        </>
        : <>
          <p>Are you sure? This will invalidate any old API keys</p>
          <Btn inverted type="button" className="block w-64 mx-auto mt-5 mb-3" onClick={run}>Yes, do it</Btn>
          <Btn type="button" className="block w-64 mx-auto" onClick={close}>Never mind</Btn>
        </>
    }
  </Dialog>
}
