import { DataClient } from "common/data-client"
import { errorLog } from "common/logger"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { User } from "types/digest"
import { getUser } from "./get-user"

const client = new DataClient()
type AuthedGSSP<P> = (ctx: GetServerSidePropsContext, user: User) => Promise<GetServerSidePropsResult<P>>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const authenticated = <Props>(fn?: AuthedGSSP<Props>) => async (ctx: GetServerSidePropsContext) => {
  const { resolvedUrl } = ctx
  const { userId } = await getUser(ctx)
  const user = userId && await client.getUser(userId)

  if (!user) return { redirect: { destination: `/login?redirect=${resolvedUrl}`, permanent: false } }

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
