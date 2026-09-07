import type { UserRole } from '../types/auth'

// 서버에서 받은 역할을 각 역할의 첫 화면 URL로 연결한다.
// 실제 세부 기능이 생기기 전까지는 역할별 보호 라우트의 진입점으로 사용한다.
export const roleHomePaths: Record<UserRole, string> = {
  STUDENT: '/student',
  TEACHER: '/teacher',
  DISCIPLINE: '/discipline',
  ADMIN: '/admin',
}

export const getRoleHomePath = (role: UserRole): string => {
  return roleHomePaths[role]
}

export const isRolePath = (pathname: string): boolean => {
  return Object.values(roleHomePaths).includes(pathname)
}
