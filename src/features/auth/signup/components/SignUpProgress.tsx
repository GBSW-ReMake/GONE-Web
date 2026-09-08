import type { SignUpStep } from '../types'

type SignUpProgressProps = {
  step: SignUpStep
}

export const SignUpProgress = ({ step }: SignUpProgressProps) => {
  return (
    <div
      aria-label={`회원가입 ${step}단계`}
      aria-valuemax={2}
      aria-valuemin={1}
      aria-valuenow={step}
      className="flex w-full gap-1.5"
      role="progressbar"
    >
      {[1, 2].map((progressStep) => (
        <span
          className={`block h-[3px] flex-1 rounded-full transition-colors duration-200 motion-reduce:transition-none ${step >= progressStep ? 'bg-[#5b8def]' : 'bg-[#eef1f5]'}`}
          key={progressStep}
        />
      ))}
    </div>
  )
}
