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

export const validateRequest = (body?: string): ValidatorResult => {
  if (!body) return { success: false, status: 400, message: 'Missing request body' }

  const { content, title, author } = JSON.parse(body)

  if (!content || !title) return { success: false, status: 400, message: 'Missing required params' }

  return { success: true, content, title, author }
}

