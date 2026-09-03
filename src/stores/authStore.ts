import { create } from 'zustand'
import type { LoginResponse } from '../types/auth'

// 인증 상태는 여러 화면에서 공유하므로 Zustand Store로 관리한다.
// 현재 MVP 정책은 새로고침 후에도 인증을 유지하기 위해 localStorage를 함께 사용한다.
type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  setAccessToken: (accessToken: string) => void
  // Pick<A, B>는 A 타입에서 B에 적은 속성만 골라 새 타입을 만든다.
  // 여기서는 LoginResponse 중 토큰 두 개만 action의 입력값으로 사용한다.
  setAuthTokens: (
    tokens: Pick<LoginResponse, 'accessToken' | 'refreshToken'>,
  ) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // 앱을 새로 시작해도 이전 로그인 토큰을 복구한다.
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  setAccessToken: (accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    set({ accessToken })
  },
  setAuthTokens: ({ accessToken, refreshToken }) => {
    // 로그인 응답의 두 토큰을 한 번에 저장해 화면과 저장소의 상태를 맞춘다.
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ accessToken, refreshToken })
  },
  clearAuth: () => {
    // 로그아웃이나 인증 실패 시 메모리 상태와 localStorage를 함께 비운다.
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ accessToken: null, refreshToken: null })
  },
}))
