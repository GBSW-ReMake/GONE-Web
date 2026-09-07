import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import AuthInitializer from '../features/auth/AuthInitializer'

import './globals.css'

export const metadata: Metadata = {
  title: 'GONE Web',
  description: '경북소프트웨어고등학교 교내 관리 서비스 GONE',
}

// Next.js App Router의 모든 화면이 공유하는 최상위 HTML 구조다.
const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="ko">
      {/* 일부 브라우저 확장이 body에 속성을 주입해도 제품 코드의 hydration 경고로 오인하지 않게 한다. */}
      <body suppressHydrationWarning>
        <AuthInitializer />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
