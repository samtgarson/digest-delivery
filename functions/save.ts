import { validateRequest } from '../lib/request-validator'
import { DataClient } from '../lib/data-client'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const data = new DataClient()

export const handler: APIGatewayProxyHandlerV2 = async evt => {
  const result = validateRequest(evt.body)

  if (!result.success) return { statusCode: result.status, body: JSON.stringify({ error: result.message }) }
  const { content, title, author } = result

  try {
    await data.createArticle(title, content, author)

    return { statusCode: 201 }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, error: { body: err.message } }
  }
}

