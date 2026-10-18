import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/useAuth'

function Navbar() {
  const { autenticado, usuario, logout } = useAuth()
  const navigate = useNavigate()

  if (!autenticado) {
    return null
  }

  const sair = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="barra-navegacao">
      <div className="navegacao-conteudo">
        <NavLink className="marca" to="/dashboard">
          Voluntariado IFRS
        </NavLink>

        <nav className="links-navegacao" aria-label="Navegação principal">
          <NavLink className="link-navegacao" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="link-navegacao" to="/events">
            Eventos
          </NavLink>
          <NavLink className="link-navegacao" to="/volunteers">
            {usuario?.role === 'admin' ? 'Voluntários' : 'Meu perfil'}
          </NavLink>
          <button className="botao-secundario" type="button" onClick={sair}>
            Sair
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
