import type { NextApiRequest } from "next"

type ValidatorResult = {
  success: true
  content: string
  title: string
  author?: string
} | {
  success: false
  status: 400 | 401
  message: string
}

export const validateRequest = (req: NextApiRequest): ValidatorResult => {
  if (!req.body) return { success: false, status: 400, message: 'Missing request body' }

  const { content, title, author } = req.body

  if (!content || !title) return { success: false, status: 400, message: 'Missing required params' }

  return { success: true, content, title, author }
}

