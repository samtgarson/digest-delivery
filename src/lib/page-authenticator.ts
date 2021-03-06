import { DataClient } from "common/data-client"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { User } from "types/digest"

type AuthedGSSP<P> = (ctx: GetServerSidePropsContext, user: User) => Promise<GetServerSidePropsResult<P>>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const authenticated = <Props>(fn?: AuthedGSSP<Props>) => async (ctx: GetServerSidePropsContext) => {
  const { req, resolvedUrl } = ctx
  const client = new DataClient()
  const { user: auth } = await client.auth.api.getUserByCookie(req)

  if (!auth) return { redirect: { destination: `/login?redirect=${resolvedUrl}`, permanent: false } }

  const user = await client.getUser(auth.id)

  if (!user) return { notFound: true }

  if (!fn) return { props: { user } }

  const pageResult = await fn(ctx, user)

  if (!('props' in pageResult)) return pageResult

  return { props: { ...pageResult.props, user } }
}
