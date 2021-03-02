import { DataClient } from "common/data-client"
import { NextApiHandler } from "next"

const client = new DataClient()

const handler: NextApiHandler = (req, res) => {
  client.auth.api.setAuthCookie(req, res)
}

export default handler
