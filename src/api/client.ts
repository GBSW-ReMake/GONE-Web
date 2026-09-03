import axios from 'axios'

// 모든 도메인 API가 공유하는 Axios 인스턴스다.
// baseURL은 환경변수로 주입해 개발·Mock·운영 서버를 코드 수정 없이 바꾼다.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 인증이 필요한 요청에 현재 Access Token을 자동으로 붙인다.
// 토큰을 각 API 함수에서 반복해서 다루지 않도록 공통 위치에 둔다.
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
