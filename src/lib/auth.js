const ADMIN_TOKEN_KEY = 'efootball_admin'
const ADMIN_PASSWORD_KEY = 'efootball_admin_pass'

export function isAdmin() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_TOKEN_KEY) === 'true'
}

export function setAdmin(value, password) {
  if (typeof window === 'undefined') return
  if (value) {
    localStorage.setItem(ADMIN_TOKEN_KEY, 'true')
    if (password) localStorage.setItem(ADMIN_PASSWORD_KEY, password)
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_PASSWORD_KEY)
  }
}

export function getAdminPassword() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || ''
}

export function adminHeaders() {
  const password = getAdminPassword()
  return {
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }
}
