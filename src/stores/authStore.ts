import { create } from 'zustand'
import type { AuthStatus, LoginResponse, MeResponse } from '../types/auth'

// 인증 상태는 여러 화면에서 공유하므로 Zustand Store로 관리한다.
// 현재 MVP 정책은 새로고침 후에도 인증을 유지하기 위해 localStorage를 함께 사용한다.
type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiresAt: number | null
  user: MeResponse | null
  status: AuthStatus
  // Pick<A, B>는 A 타입에서 B에 적은 속성만 골라 새 타입을 만든다.
  // 여기서는 LoginResponse 중 토큰 두 개만 action의 입력값으로 사용한다.
  setAuthTokens: (
    tokens: Pick<
      LoginResponse,
      'accessToken' | 'refreshToken' | 'accessTokenExpiresIn'
    >,
  ) => void
  setUser: (user: MeResponse) => void
  setAuthStatus: (status: AuthStatus) => void
  clearAuth: () => void
}

// Next.js는 화면을 서버에서 먼저 그릴 수 있어 localStorage가 아직 없는 순간이 있다.
// window가 없는 서버에서는 null을 반환해 서버 렌더링 오류를 막는다.
const getStoredToken = (key: string): string | null => {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
}

const getStoredTimestamp = (key: string): number | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(key)
  const timestamp = value ? Number(value) : NaN

  return Number.isFinite(timestamp) ? timestamp : null
}

const setStoredToken = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

const removeStoredToken = (key: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key)
  }
}

const setStoredTimestamp = (key: string, value: number): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, String(value))
  }
}

const removeStoredValue = (key: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key)
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  // 앱을 새로 시작해도 이전 로그인 토큰을 복구한다.
  accessToken: getStoredToken('accessToken'),
  refreshToken: getStoredToken('refreshToken'),
  accessTokenExpiresAt: getStoredTimestamp('accessTokenExpiresAt'),
  user: null,
  status: 'idle',
  setAuthTokens: ({ accessToken, refreshToken, accessTokenExpiresIn }) => {
    // 로그인 응답의 두 토큰을 한 번에 저장해 화면과 저장소의 상태를 맞춘다.
    const accessTokenExpiresAt =
      Date.now() + Math.max(accessTokenExpiresIn, 0) * 1000

    setStoredToken('accessToken', accessToken)
    setStoredToken('refreshToken', refreshToken)
    setStoredTimestamp('accessTokenExpiresAt', accessTokenExpiresAt)
    set({ accessToken, refreshToken, accessTokenExpiresAt })
  },
  setUser: (user) => {
    set({ user, status: 'authenticated' })
  },
  setAuthStatus: (status) => {
    set({ status })
  },
  clearAuth: () => {
    // 로그아웃이나 인증 실패 시 메모리 상태와 localStorage를 함께 비운다.
    removeStoredToken('accessToken')
    removeStoredToken('refreshToken')
    removeStoredValue('accessTokenExpiresAt')
    set({
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      user: null,
      status: 'unauthenticated',
    })
  },
}))
