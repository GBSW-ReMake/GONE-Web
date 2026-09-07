// React의 HTML input 속성 타입만 가져온다. `type`은 실행 코드가 아닌 타입이라 번들에 포함되지 않는다.
import type { InputHTMLAttributes, ReactNode } from 'react'

// InputHTMLAttributes<HTMLInputElement>:
// "HTML input 태그가 받을 수 있는 모든 기본 속성을 허용한다"는 뜻이다.
// 뒤의 `<HTMLInputElement>`는 그 속성이 input 요소용이라는 것을 알려주는 제네릭이다.
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // `&`는 React 기본 input 속성과 아래에서 만든 우리 속성을 합친다는 뜻이다.
  label: string
  // `?`는 error를 전달하지 않아도 된다는 뜻이다. 전달하면 오류 문구를 표시한다.
  error?: string
  // helperText는 정상 안내 문구, helperTone은 성공 상태의 색상을 선택한다.
  helperText?: string
  helperTone?: 'default' | 'success'
  // endAdornment는 입력창 오른쪽에 인증번호 발송 같은 동작을 끼워 넣는 자리다.
  endAdornment?: ReactNode
}

// label과 input을 항상 연결해 화면 재사용성과 키보드·스크린리더 접근성을 보장한다.
export const Input = ({
  id,
  label,
  error,
  helperText,
  helperTone = 'default',
  endAdornment,
  // className이 없으면 빈 문자열을 사용한다. 나머지 HTML 속성은 props에 모은다.
  className = '',
  ...props
}: InputProps) => {
  // 오류 문구가 있을 때만 input과 오류 문구를 aria로 연결한다.
  const errorId = error && id ? `${id}-error` : undefined
  const helperId = !error && helperText && id ? `${id}-helper` : undefined
  // 오류가 있으면 오류 설명을, 없으면 도움말을 input의 설명으로 연결한다.
  const describedBy = errorId ?? helperId

  const inputClassName = [
    'h-[43px] w-full rounded-none border-0 border-b-2 border-[#dde1e6] bg-transparent p-[8px_16px_8px_0] text-[16px] font-normal leading-[22px] text-[#1f2937] outline-none transition-colors duration-[160ms] placeholder:text-[#98a0aa] placeholder:opacity-100 focus:border-[#5b8def] disabled:bg-transparent disabled:text-[#667085] aria-[invalid=true]:border-[#ef6b6b] motion-reduce:transition-none',
    endAdornment ? 'pr-[116px]' : '',
    className,
  ]
    .join(' ')
    .trim()

  return (
    <div className="flex flex-col gap-0.5">
      <label
        className="text-[12px] font-[510] leading-[18px] text-[#667085]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={inputClassName}
          id={id}
        />
        {endAdornment && (
          <div className="absolute right-0 bottom-[9px]">{endAdornment}</div>
        )}
      </div>
      {error && (
        <p
          className="m-0 text-[12px] leading-[18px] text-[#d84c4c]"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p
          className={`m-0 text-[12px] leading-[18px] ${
            helperTone === 'success' ? 'text-[#2f855a]' : 'text-[#667085]'
          }`}
          id={helperId}
          aria-live="polite"
        >
          {helperText}
        </p>
      )}
    </div>
  )
}
