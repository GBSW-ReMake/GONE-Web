import { BrowserRouter, Route, Routes } from 'react-router-dom'

const HomePage = () => {
  return <h1>GONE Web</h1>
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
