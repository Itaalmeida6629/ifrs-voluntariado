import { useState } from 'react'

import api from '../api/api'
import AuthContext from './contextoAuth'

function decodificarToken(token) {
  const parteToken = token.split('.')[1]
  const base64 = parteToken.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    Array.from(window.atob(base64), (caractere) => `%${caractere.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')
  )

  return JSON.parse(json)
}

function recuperarSessao() {
  const token = sessionStorage.getItem('token')

  if (!token) {
    return { token: null, usuario: null }
  }

  try {
    const usuario = decodificarToken(token)
    if (usuario.exp && usuario.exp * 1000 <= Date.now()) {
      sessionStorage.removeItem('token')
      return { token: null, usuario: null }
    }

    return { token, usuario }
  } catch {
    sessionStorage.removeItem('token')
    return { token: null, usuario: null }
  }
}

export function AuthProvider({ children }) {
  const sessaoInicial = recuperarSessao()
  const [token, setToken] = useState(sessaoInicial.token)
  const [usuario, setUsuario] = useState(sessaoInicial.usuario)

  const login = async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha })
    const usuarioLogado = decodificarToken(data.token)

    sessionStorage.setItem('token', data.token)
    setToken(data.token)
    setUsuario(usuarioLogado)

    return usuarioLogado
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuario, autenticado: Boolean(token && usuario), login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
