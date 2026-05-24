import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/api/auth.api'
import { setUnauthorizedHandler } from '@/api/axios'
import { ROLES } from '@/utils/constants'
import { storage } from '@/utils/storage'
import { getApiErrorMessage } from '@/services/apiError'
import { parseLoginResponse } from '@/services/authResponse'

export const AuthContext = createContext(null)

export function AuthProvider({ children, onUnauthorized }) {
  const [token, setToken] = useState(() => storage.getToken())
  const [role, setRole] = useState(() => storage.getRole())
  const [name, setName] = useState(() => storage.getName())
  const [email, setEmail] = useState(() => storage.getEmail())
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(token)
  const isAdmin = role === ROLES.ADMIN
  const isUser = role === ROLES.USER

  const clearSession = useCallback(() => {
    storage.clearAuth()
    setToken(null)
    setRole(null)
    setName(null)
    setEmail(null)
  }, [])

  const persistSession = useCallback(({ token: newToken, role: newRole, name: newName, email: newEmail }) => {
    storage.setToken(newToken)
    storage.setRole(newRole)
    if (newName) storage.setName(newName)
    if (newEmail) storage.setEmail(newEmail)
    setToken(newToken)
    setRole(newRole)
    if (newName) setName(newName)
    if (newEmail) setEmail(newEmail)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.login(credentials)
      const session = parseLoginResponse(data)
      persistSession({
        token: session.token,
        role: session.role,
        email: credentials.email,
        name: data?.name ?? data?.data?.name,
      })
      return { success: true, role: session.role }
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      await authApi.register(payload)
      return { success: true }
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      onUnauthorized?.()
    })
  }, [clearSession, onUnauthorized])

  const value = useMemo(
    () => ({
      token,
      role,
      name,
      email,
      loading,
      isAuthenticated,
      isAdmin,
      isUser,
      login,
      register,
      logout,
    }),
    [token, role, name, email, loading, isAuthenticated, isAdmin, isUser, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
