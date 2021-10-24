import { User } from "types/digest"

export class InternalApiClient {
  async updateUser (attrs: Partial<User>) {
    const res = await fetch('/api/me', {
      method: 'PATCH',
      body: JSON.stringify(attrs),
      headers: { 'Content-Type': 'application/json' }
    })

    return { ok: res.ok, ...(await res.json()) }
  }
}
