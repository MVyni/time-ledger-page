import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { HttpClient } from '@/lib/http-client'

describe('HttpClient (unit)', () => {
  let client: HttpClient

  beforeEach(() => {
    client = new HttpClient()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should make a GET request', async () => {
    const mockData = { entries: [] }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    )

    const result = await client.get<{ entries: unknown[] }>('/api/test')

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    })
    expect(result.entries).toEqual([])
  })

  it('should make a POST request with body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ token: 'abc' }), { status: 200 }),
    )

    const result = await client.post<{ token: string }>('/api/login', {
      email: 'test@test.com',
    })

    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: 'test@test.com' }),
    })
    expect(result.token).toBe('abc')
  })

  it('should throw Response on non-ok status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Unauthorized', { status: 401 }),
    )

    await expect(client.get('/api/protected')).rejects.toBeInstanceOf(Response)
  })

  it('should set and send Authorization header', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    )

    client.setAuthToken('my-token')
    await client.get('/api/test')

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: 'Bearer my-token',
      }),
    })
  })

  it('should remove Authorization header', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    )

    client.setAuthToken('my-token')
    client.removeAuthToken()
    await client.get('/api/test')

    const callArgs = vi.mocked(fetch).mock.calls[0]!
    const headers = callArgs[1]?.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('should make a DELETE request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 }),
    )

    await client.delete('/api/entries/123')

    expect(fetch).toHaveBeenCalledWith('/api/entries/123', {
      method: 'DELETE',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    })
  })

  it('should make a PUT request with body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ updated: true }), { status: 200 }),
    )

    await client.put('/api/entries/123', { durationMinutes: 120 })

    expect(fetch).toHaveBeenCalledWith('/api/entries/123', {
      method: 'PUT',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ durationMinutes: 120 }),
    })
  })
})
