'use client'

import type { ReactNode } from 'react'

import { Splash } from '../../components/Splash'
import { useAuthStore } from '../../stores/authStore'

// 인증 이후 모든 화면이 공유하는 보호 경계다.
// 사용자 확인이 끝나기 전에는 실제 화면 대신 Splash만 보여줘 정보 노출과 화면 깜빡임을 막는다.
const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)

  if (status !== 'authenticated' || !user) {
    return <Splash />
  }

  return children
}

export default DashboardLayout
