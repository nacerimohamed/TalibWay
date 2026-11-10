
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { apiRequest } from '../services/api'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('talibway_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await apiRequest('/user')
        setUser(data.user)
      } catch {
        localStorage.removeItem('talibway_token')
        localStorage.removeItem('talibway_user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function logout() {
    try {
      await apiRequest('/logout', {
        method: 'POST',
      })
    } finally {
      localStorage.removeItem('talibway_token')
      localStorage.removeItem('talibway_user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
