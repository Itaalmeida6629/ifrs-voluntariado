import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../contexts/useAuth'

function ProtectedRoute({ rolesPermitidas }) {
  const { autenticado, usuario } = useAuth()
  const location = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (rolesPermitidas && !rolesPermitidas.includes(usuario.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
