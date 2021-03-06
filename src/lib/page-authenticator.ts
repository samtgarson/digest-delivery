import { DataClient } from "common/data-client"
import { errorLog } from "common/logger"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { User } from "types/digest"

type AuthedGSSP<P> = (ctx: GetServerSidePropsContext, user: User) => Promise<GetServerSidePropsResult<P>>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const authenticated = <Props>(fn?: AuthedGSSP<Props>) => async (ctx: GetServerSidePropsContext) => {
  const { req, resolvedUrl } = ctx
  const client = new DataClient()
  const { user: auth } = await client.auth.api.getUserByCookie(req)

  if (!auth) return { redirect: { destination: `/login?redirect=${resolvedUrl}`, permanent: false } }

  let user: User | null
  try {
    user = await client.getUser(auth.id)
  } catch (e) {
    return { redirect: { destination: '/logout', permanent: false } }
  }

  if (!user) return { redirect: { destination: '/logout', permanent: false } }

  if (!fn) return { props: { user } }

  try {
    const pageResult = await fn(ctx, user)
    if (!('props' in pageResult)) return pageResult

    return { props: { ...pageResult.props, user } }
  } catch (error) {
    errorLog(error)
    ctx.res.statusCode = 500
    return { props: { _error: error } }
  }
}
