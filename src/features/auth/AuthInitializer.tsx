'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { getMe } from '../../api/auth'
import { getRoleHomePath, isRolePath } from '../../constants/auth'
import { useAuthStore } from '../../stores/authStore'

const publicPaths = ['/login', '/signup']

// 로그인·회원가입을 제외한 화면에서 토큰과 사용자 정보를 확인한다.
// 이 컴포넌트가 인증 초기화와 역할별 첫 화면 이동을 한 곳에서 담당한다.
const AuthInitializer = () => {
  const pathname = usePathname()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const currentPathname = pathname ?? '/'
  const isPublicPath = publicPaths.includes(currentPathname)

  useEffect(() => {
    if (isPublicPath) {
      return
    }

    const initializeAuth = async (): Promise<void> => {
      const currentAuth = useAuthStore.getState()

      if (
        currentAuth.status === 'unauthenticated' &&
        !currentAuth.accessToken &&
        !currentAuth.refreshToken
      ) {
        router.replace('/login')
        return
      }

      if (currentAuth.status === 'authenticated' && currentAuth.user) {
        const roleHomePath = getRoleHomePath(currentAuth.user.role)

        if (
          currentPathname === '/' ||
          (isRolePath(currentPathname) && currentPathname !== roleHomePath)
        ) {
          router.replace(roleHomePath)
        }

        return
      }

      if (!currentAuth.accessToken && !currentAuth.refreshToken) {
        clearAuth()
        router.replace('/login')
        return
      }

      setAuthStatus('initializing')

      try {
        // 실제 요청에서 Access Token이 만료되면 Axios 응답 인터셉터가 재발급 후 재시도한다.
        const response = await getMe()

        if (!response.success) {
          throw new Error('내 정보 조회 실패')
        }

        setUser(response.data)
        const roleHomePath = getRoleHomePath(response.data.role)

        if (
          currentPathname === '/' ||
          (isRolePath(currentPathname) && currentPathname !== roleHomePath)
        ) {
          router.replace(roleHomePath)
        }
      } catch {
        // 사용자에게 원본 오류를 노출하지 않고 인증 상태를 안전하게 종료한다.
        clearAuth()
        router.replace('/login')
      }
    }

    void initializeAuth()
  }, [clearAuth, currentPathname, isPublicPath, router, setAuthStatus, setUser])

  // 실제 보호 화면의 로딩 UI는 `(dashboard)/layout.tsx`가 렌더링한다.
  // 초기화 컴포넌트는 인증 확인과 라우팅만 담당해 Splash 중복 표시를 막는다.
  return null
}

export default AuthInitializer
