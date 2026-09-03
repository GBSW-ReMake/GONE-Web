// React의 HTML input 속성 타입만 가져온다. `type`은 실행 코드가 아닌 타입이라 번들에 포함되지 않는다.
import type { InputHTMLAttributes } from 'react'

// InputHTMLAttributes<HTMLInputElement>:
// "HTML input 태그가 받을 수 있는 모든 기본 속성을 허용한다"는 뜻이다.
// 뒤의 `<HTMLInputElement>`는 그 속성이 input 요소용이라는 것을 알려주는 제네릭이다.
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // `&`는 React 기본 input 속성과 아래에서 만든 우리 속성을 합친다는 뜻이다.
  label: string
  // `?`는 error를 전달하지 않아도 된다는 뜻이다. 전달하면 오류 문구를 표시한다.
  error?: string
}

// label과 input을 항상 연결해 화면 재사용성과 키보드·스크린리더 접근성을 보장한다.
export const Input = ({
  id,
  label,
  error,
  // className이 없으면 빈 문자열을 사용한다. 나머지 HTML 속성은 props에 모은다.
  className = '',
  ...props
}: InputProps) => {
  // 오류 문구가 있을 때만 input과 오류 문구를 aria로 연결한다.
  const errorId = error && id ? `${id}-error` : undefined

  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        {...props}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={`ui-input ${className}`.trim()}
        id={id}
      />
      {error && (
        <p className="ui-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
