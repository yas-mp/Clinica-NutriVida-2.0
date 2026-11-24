import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto pt-4 pb-3 navbar-custom text-white">
      <div className="container">
        <div className="row gy-3 align-items-start text-center text-md-start">
          <div className="col-md-5">
            <h5 className="fw-bold mb-2">Clínica Nutricional NutriVida</h5>
            <p className="small text-white-50 mb-0">
              Atención nutricional integral, planes personalizados y bienestar
              alimentario presencial y online.
            </p>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold text-uppercase small mb-2">Navegación</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1">
                <Link to="/" className="text-white text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/servicios"
                  className="text-white text-decoration-none"
                >
                  Servicios
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/contacto"
                  className="text-white text-decoration-none"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase small mb-2">Contacto</h6>
            <ul className="list-unstyled small text-white-50 mb-0">
              <li className="mb-1">Temuco, Región de La Araucanía, Chile</li>
              <li className="mb-1">contacto@nutrivida.cl</li>
              <li>Lunes a Viernes: 09:00 – 19:00 hrs</li>
            </ul>
          </div>
        </div>

        <hr className="border-light opacity-25 my-3" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-white-50">
          <span>Clínica Nutricional - NutriVida &copy; 2026</span>
          <span>Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;