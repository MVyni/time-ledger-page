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

interface AuthContextData {
  isAuthenticated: boolean
  isLoading: boolean
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

  useEffect(() => {
    const token = TokenStorage.get()

    if (token) {
      httpClient.setAuthToken(token)
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const signIn = useCallback((token: string) => {
    TokenStorage.save(token)
    httpClient.setAuthToken(token)
    setIsAuthenticated(true)
  }, [])

  const signOut = useCallback(() => {
    TokenStorage.remove()
    httpClient.removeAuthToken()
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signIn, signOut }}
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
