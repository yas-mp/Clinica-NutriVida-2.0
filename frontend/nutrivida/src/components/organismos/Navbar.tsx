import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // si hay sesión activa VE SI MUESTRA "Mi portal" o "Cerrar sesión"
  const sesionActiva = localStorage.getItem("nutrivida_usuario_activo");
  const usuario = sesionActiva ? JSON.parse(sesionActiva) : null;

  const enVistaPrivada =
    location.pathname === "/usuario" || location.pathname === "/nutricionista";

  const cerrarSesion = () => {
    localStorage.removeItem("nutrivida_usuario_activo");
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navCustom" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-white" to="/">
            NutriVida
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/nosotros">
                  Nosotros
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/profesionales">
                  Profesionales
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/reservas-horas">
                  Reserva hora
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/contacto">
                  Contáctanos
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/servicios">
                  Servicios
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/blog">
                  Blog
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {usuario || enVistaPrivada ? (
                <>
                  <Link
                    className="btn btn-success btn-sm"
                    to={usuario?.rol === "NUTRICIONISTA" ? "/nutricionista" : "/usuario"}
                    style={{ borderRadius: "15px" }}
                  >
                    Mi Panel
                  </Link>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={cerrarSesion}
                    style={{
                      borderRadius: "15px",
                      backgroundColor: "rgb(114, 21, 21)",
                      border: "none",
                    }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  className="btn btn-success btn-sm"
                  to="/login"
                  style={{ borderRadius: "15px" }}
                >
                  Mi portal
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;