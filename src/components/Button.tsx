// ButtonHTMLAttributes는 HTML button의 기본 속성 타입이고, ReactNode는 화면에 렌더링할 수 있는 값의 타입이다.
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// `<HTMLButtonElement>`는 "이 기본 속성들이 button 태그용"이라고 지정하는 제네릭이다.
// `&`는 React 기본 button 속성과 GONE 전용 loading 속성을 합친다.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // children은 <Button>로그인</Button>에서 안쪽의 "로그인"을 의미한다.
  children: ReactNode
  // `?`가 붙은 속성은 선택사항이며, loading을 생략하면 아래 함수에서 false를 기본값으로 사용한다.
  loading?: boolean
  loadingLabel?: string
}

// 모든 인증 화면에서 같은 버튼 크기와 로딩·비활성화 동작을 재사용한다.
export const Button = ({
  children,
  // 구조 분해하면서 기본값을 지정한다. 호출자가 값을 안 보내도 안전하게 동작한다.
  loading = false,
  loadingLabel = '처리 중...',
  disabled = false,
  // 공통 버튼의 기본 클래스에 화면별 클래스를 추가할 수 있도록 받는다.
  className = '',
  // 위에서 꺼낸 전용 속성을 제외한 나머지 HTML button 속성을 props에 모은다.
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      // 보조기술에 현재 작업이 진행 중임을 알린다.
      aria-busy={loading}
      className={`ui-button ${className}`.trim()}
      // 요청 중에는 중복 제출을 막기 위해 항상 버튼을 잠근다.
      disabled={disabled || loading}
    >
      {loading ? loadingLabel : children}
    </button>
  )
}
