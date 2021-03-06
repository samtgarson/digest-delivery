import { DataClient } from 'common/data-client'
import { useSupabase } from "use-supabase"
import { useAuth } from './use-auth'

function validKey (target: DataClient, key: string | number | symbol): key is keyof DataClient {
  return key in target
}

export const useDataClient = (): DataClient => {
  const supabase = useSupabase()
  const { reauth } = useAuth()

  const client = new DataClient(supabase)

  return new Proxy(client, {
    get (target, property) {
      if (!validKey(target, property)) return undefined
      if (!(target[property] instanceof Function) || property === 'auth') return target[property]

      return new Proxy(target[property], {
        apply (method, thisArg, args) {
          const result = Reflect.apply(method, thisArg, args)
          if (result instanceof Promise) return result.catch(e => {
            if (e.message !== 'JWT expired') throw e
            reauth()
          })

          return result
        }
      })
    }
  })
}
