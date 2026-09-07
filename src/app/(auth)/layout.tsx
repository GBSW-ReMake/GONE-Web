'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

// 로그인·회원가입이 공유하는 인증 화면의 무대다.
// 두 화면 모두 폼은 왼쪽, 학교 사진은 오른쪽에 고정하고 입력 로직은 각 화면이 담당한다.
const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname()

  return (
    <main className="relative min-h-screen overflow-hidden bg-white max-[800px]:overflow-y-auto">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[48.75%] z-[1] w-[51.25%] overflow-hidden max-[1400px]:left-1/2 max-[1400px]:w-1/2 max-[800px]:hidden"
      >
        <img
          alt=""
          className="block h-full w-full object-cover object-center"
          src="/school-building.png"
        />
      </div>

      <section
        aria-label="GONE 인증"
        className="absolute inset-y-0 left-0 z-[2] flex w-[48.75%] items-center justify-center bg-white px-[100px] max-[1400px]:w-1/2 max-[1400px]:px-[clamp(32px,8vw,100px)] max-[800px]:relative max-[800px]:min-h-screen max-[800px]:w-full max-[800px]:p-10 max-[800px]:px-6"
      >
        <div className="w-[404px] max-w-full max-[800px]:flex max-[800px]:justify-center">
          {/* pathname을 key로 사용해 로그인·회원가입 화면이 바뀔 때 진입 애니메이션을 다시 실행한다. */}
          <div
            className="w-[404px] max-w-full animate-auth-route-enter motion-reduce:animate-none"
            key={pathname}
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
