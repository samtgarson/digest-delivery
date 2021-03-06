import type { NextApiRequest } from "next"
import { ArticleAttributes } from "types/digest"

type ValidatorResult = {
  success: true
  article: ArticleAttributes
} | {
  success: false
  status: 400 | 401
  message: string
}

export const validateArticlesRequest = (req: NextApiRequest): ValidatorResult => {
  if (!req.body) return { success: false, status: 400, message: 'Missing request body' }

  const { content, title, author, source, original_url } = req.body

  if (!content || !title) return { success: false, status: 400, message: 'Missing required params' }

  return { success: true, article: { content, title, author, source, original_url } }
}

