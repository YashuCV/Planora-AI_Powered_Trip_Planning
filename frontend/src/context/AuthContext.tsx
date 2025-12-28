import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from '../services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch {
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { user: userData, token } = await authService.login(email, password)
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const register = async (email: string, password: string, fullName: string) => {
    const { user: userData, token } = await authService.register(email, password, fullName)
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const loginWithGoogle = async () => {
    // Redirect to Google OAuth flow
    const { user: userData, token } = await authService.loginWithGoogle()
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

