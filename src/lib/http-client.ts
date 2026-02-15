export class HttpClient {
  private baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  setAuthToken(token: string) {
    this.baseHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.baseHeaders['Authorization']
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseHeaders,
    })

    if (!response.ok) throw response

    return response.json()
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.baseHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) throw response

    const text = await response.text()
    return text ? JSON.parse(text) : ({} as T)
  }

  async put<T>(url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.baseHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) throw response

    const text = await response.text()
    return text ? JSON.parse(text) : ({} as T)
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.baseHeaders,
    })

    if (!response.ok) throw response
  }
}

export const httpClient = new HttpClient()
