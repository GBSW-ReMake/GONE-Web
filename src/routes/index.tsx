import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'

// 로그인·회원가입은 인증 없이 접근하는 공개 라우트다.
// 보호 라우트와 역할 검사는 인증 Store 작업에서 별도로 추가한다.
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  )
}
