// 사용자 정보를 확인하는 동안 잠깐 보여주는 인증 초기화 화면이다.
// 보호 화면이 잠깐 노출되는 현상(화면 깜빡임)을 줄이는 역할을 한다.
export const Splash = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4" role="status">
        <img alt="GONE" className="h-8 w-auto" src="/gone-logo.svg" />
        <p className="m-0 text-sm text-[#98a0aa]">
          인증 정보를 확인하고 있어요.
        </p>
      </div>
    </main>
  )
}
