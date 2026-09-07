import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { useAuthStore } from '../stores/authStore'
import type { ApiResponse, ReissueResponse } from '../types/auth'

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
}

let refreshPromise: Promise<string | null> | null = null

const publicAuthPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/signup',
  '/api/v1/auth/phone/send-code',
  '/api/v1/auth/phone/verify-code',
  '/api/v1/auth/login-id/check',
  '/api/v1/auth/logout',
]

// 로그인·회원가입처럼 원래 Access Token이 필요하지 않은 요청은 401이어도 재발급하지 않는다.
const isPublicAuthPath = (url?: string): boolean => {
  return Boolean(url && publicAuthPaths.some((path) => url.includes(path)))
}

// 모든 도메인 API가 공유하는 Axios 인스턴스다.
// baseURL은 환경변수로 주입해 개발·운영 서버 주소를 코드 수정 없이 바꾼다.
export const apiClient = axios.create({
  // Next.js 브라우저 환경변수는 NEXT_PUBLIC_ 접두사가 있어야 클라이언트에 포함된다.
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 인증이 필요한 요청에 현재 Access Token을 자동으로 붙인다.
// 토큰을 각 API 함수에서 반복해서 다루지 않도록 공통 위치에 둔다.
apiClient.interceptors.request.use((config) => {
  // 서버에서 모듈이 먼저 평가될 수도 있으므로 window가 있을 때만 브라우저 저장소를 읽는다.
  const accessToken =
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// 만료된 Access Token을 한 번만 재발급한다. 여러 요청이 동시에 401이어도 요청을 합친다.
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken =
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem('refreshToken')

  if (!refreshToken) {
    return null
  }

  try {
    // 재발급 요청이 다시 401이 되어도 재발급을 무한 반복하지 않도록 표시한다.
    const response = await apiClient.post<ApiResponse<ReissueResponse>>(
      '/api/v1/auth/reissue',
      { refreshToken },
      { _skipAuthRefresh: true } as AxiosRequestConfig,
    )

    if (!response.data.success) {
      return null
    }

    useAuthStore.getState().setAuthTokens(response.data.data)
    return response.data.data.accessToken
  } catch {
    return null
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AuthRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest._skipAuthRefresh ||
      isPublicAuthPath(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null
    })

    const nextAccessToken = await refreshPromise

    if (!nextAccessToken) {
      // 재발급까지 실패하면 인증을 끝내고 보호 화면에서 로그인으로 돌려보낸다.
      useAuthStore.getState().clearAuth()

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.assign('/login')
      }

      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
    return apiClient(originalRequest)
  },
)
