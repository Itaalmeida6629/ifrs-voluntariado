import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Login from './pages/Login'
import Volunteers from './pages/Volunteers'

function App() {
  return (
    <BrowserRouter>
      <main className="layout-principal">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
