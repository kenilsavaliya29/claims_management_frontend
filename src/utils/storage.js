import { STORAGE_KEYS } from './constants'

export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  getRole: () => localStorage.getItem(STORAGE_KEYS.ROLE),
  setRole: (role) => localStorage.setItem(STORAGE_KEYS.ROLE, role),
  getName: () => localStorage.getItem(STORAGE_KEYS.NAME),
  setName: (name) => localStorage.setItem(STORAGE_KEYS.NAME, name),
  getEmail: () => localStorage.getItem(STORAGE_KEYS.EMAIL),
  setEmail: (email) => localStorage.setItem(STORAGE_KEYS.EMAIL, email),
  clearAuth: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  },
}
