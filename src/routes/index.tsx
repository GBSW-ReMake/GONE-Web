import { BrowserRouter, Route, Routes } from 'react-router-dom'

function HomePage() {
  return <h1>GONE Web</h1>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
