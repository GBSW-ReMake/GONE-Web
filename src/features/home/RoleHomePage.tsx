'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { logout as logoutApi } from '../../api/auth'
import { Splash } from '../../components/Splash'
import { useAuthStore } from '../../stores/authStore'
import type { UserRole } from '../../types/auth'

const roleLabels: Record<UserRole, string> = {
  STUDENT: '학생',
  TEACHER: '교사',
  DISCIPLINE: '선도부',
  ADMIN: '관리자',
}

// 역할별 보호 라우트에 연결되는 임시 첫 화면이다.
// 실제 도메인 화면이 추가되면 이 자리에 역할별 dashboard를 연결한다.
type RoleHomePageProps = {
  expectedRole: UserRole
}

const RoleHomePage = ({ expectedRole }: RoleHomePageProps) => {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logoutApi()
    } finally {
      // 서버 로그아웃이 실패해도 브라우저에 남은 토큰은 반드시 제거한다.
      clearAuth()
      router.replace('/login')
      setIsLoggingOut(false)
    }
  }

  // 주소의 역할과 사용자 역할이 다르면 AuthInitializer가 올바른 주소로 바꿀 때까지 내용을 숨긴다.
  if (!user || user.role !== expectedRole) {
    return <Splash />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faff] px-6">
      <section className="flex w-full max-w-[480px] flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0_16px_50px_rgba(31,41,55,0.08)]">
        <div>
          <p className="m-0 text-sm font-semibold text-[#5b8def]">
            {roleLabels[user.role]} 전용 화면
          </p>
          <h1 className="mt-2 mb-0 text-2xl font-bold text-[#1f2937]">
            {user.name}님, 환영합니다.
          </h1>
          <p className="mt-3 mb-0 text-sm text-[#667085]">
            역할별 보호 라우트와 인증 초기화가 정상적으로 연결되었습니다.
          </p>
        </div>
        <button
          className="h-11 rounded-xl border-0 bg-[#5b8def] text-sm font-bold text-white transition-colors hover:bg-[#477bdc] focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </section>
    </main>
  )
}

export default RoleHomePage
