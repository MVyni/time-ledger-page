import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { TokenStorage } from '@/lib/token-storage'
import { httpClient } from '@/lib/http-client'
import type { User } from '@/types'

interface AuthContextData {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  signIn: (token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const loadUser = useCallback(async () => {
    try {
      const response = await httpClient.get<{ user: User }>('/api/user/me')
      setUser(response.user)
    } catch {
      TokenStorage.remove()
      httpClient.removeAuthToken()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    const token = TokenStorage.get()

    if (token) {
      httpClient.setAuthToken(token)
      setIsAuthenticated(true)
      loadUser()
    }

    setIsLoading(false)
  }, [loadUser])

  const signIn = useCallback((token: string) => {
    TokenStorage.save(token)
    httpClient.setAuthToken(token)
    setIsAuthenticated(true)
    loadUser()
  }, [loadUser])

  const signOut = useCallback(() => {
    TokenStorage.remove()
    httpClient.removeAuthToken()
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
