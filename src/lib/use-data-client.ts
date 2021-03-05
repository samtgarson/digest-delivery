import { DataClient } from 'common/data-client'
import { useRouter } from 'next/dist/client/router'
import { useSupabase } from "use-supabase"

function validKey (target: DataClient, key: string | number | symbol): key is keyof DataClient {
  return key in target
}

// function isFunction (target: any): target is Function {
//   return 'apply' in target
// }

export const useDataClient = (): DataClient => {
  const supabase = useSupabase()
  const router = useRouter()

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

            router.push('/login')
          })

          return result
        }
      })
    }
  })
}
