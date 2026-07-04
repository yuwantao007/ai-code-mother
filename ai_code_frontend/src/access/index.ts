export const ROLE_ENUM = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export type AccessRole = (typeof ROLE_ENUM)[keyof typeof ROLE_ENUM]

export const normalizeRole = (role?: string) => role?.trim().toLowerCase() || ROLE_ENUM.USER

export const isAdmin = (loginUser?: API.LoginUserVO) =>
  normalizeRole(loginUser?.userRole) === ROLE_ENUM.ADMIN

export const canAccess = (loginUser: API.LoginUserVO | undefined, access?: AccessRole | string) => {
  if (!access) {
    return true
  }

  if (access === ROLE_ENUM.ADMIN) {
    return isAdmin(loginUser)
  }

  return Boolean(loginUser?.id)
}

export const getRoleLabel = (role?: string) => {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === ROLE_ENUM.ADMIN) {
    return '管理员'
  }

  return '普通用户'
}
