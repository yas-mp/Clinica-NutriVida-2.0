import { Link } from "react-router-dom";
import carruselImagen from "../assets/images/carrusel-imagen.jpg";
import carruselNutri from "../assets/images/carrusel-nutricionista.webp";
import imagenIcono1 from "../assets/images/icono1.jpg";
import imagenIcono2 from "../assets/images/icono2.jpg";
import imagenIcono3 from "../assets/images/icono3.webp";

function Main() {
  return (
    <main>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={carruselImagen}
              className="d-block w-100"
              alt="nutricionista-banner"
            />
            <div className="carousel-caption d-none d-md-block">
              <div
                className="bg-white text-dark p-4 rounded-4 shadow-lg mx-auto"
                style={{ maxWidth: "500px", opacity: "0.9" }}
              >
                <h2 className="fw-bold text-success">Clinica Nutricional</h2>
                <p className="fw-bold text-uppercase text-secondary mb-2">
                  Tú bienestar comienza hoy
                </p>
                <p className="mb-3">
                  Nutrición para recuperar tu salud, mejorar tu bienestar, bajar
                  de peso y <strong>sentirse mejor.</strong>
                </p>
                <Link
                  to=""
                  className="btn btn-success rounded-pill px-4"
                >
                  Reservar hora
                </Link>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src={carruselNutri}
              className="d-block w-100"
              alt="carrusel-nutricionista"
            />
            <div className="carousel-caption d-none d-md-block">
              <div
                className="bg-white text-dark p-4 rounded-4 shadow-lg mx-auto"
                style={{ maxWidth: "500px", opacity: "0.9" }}
              >
                <h2 className="fw-bold text-success">Clínica Nutricional</h2>
                <p className="fw-bold text-uppercase text-secondary mb-2">
                  Tu bienestar comienza hoy
                </p>
                <Link
                  to=""
                  className="btn btn-success rounded-pill px-4"
                >
                  Reservar hora
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <div className="container my-4" style={{ maxWidth: "1300px" }}>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          
          <div className="col">
            <div className="card carta-corta text-center">
              <img
                src={imagenIcono1}
                className="card-img-top mx-auto mt-2 img-icono"
                alt="Icono1"
                style={{ width: "60px", height: "60px", borderRadius: "20px" }}
              />
              <div className="card-body">
                <h5 className="card-title">Plan especializado</h5>
                <p className="card-text">
                  Para pacientes que requieren atención fuera de su control habitual.
                </p>
              </div>
              <div
                className="card-footer"
                style={{ backgroundColor: "rgb(75, 69, 69)" }}
              ></div>
            </div>
          </div>

          <div className="col">
            <div className="card carta-corta text-center">
              <img
                src={imagenIcono3}
                className="card-img-top mx-auto mt-2 img-icono"
                alt="Icono3"
                style={{ width: "60px", height: "60px", borderRadius: "20px" }}
              />
              <div className="card-body">
                <h5 className="card-title">Teleconsulta Nutricional</h5>
                <p className="card-text">
                  Consulta de seguimiento vía videollamada. Requiere contar con
                  consulta presencial previa.
                </p>
              </div>
              <div
                className="card-footer"
                style={{ backgroundColor: "rgb(75, 69, 69)" }}
              ></div>
            </div>
          </div>

          <div className="col">
            <div className="card carta-corta text-center">
              <img
                src={imagenIcono2}
                className="card-img-top mx-auto mt-2 img-icono"
                alt="Icono2"
                style={{ width: "60px", height: "60px", borderRadius: "20px" }}
              />
              <div className="card-body">
                <h5 className="card-title">Talleres grupales</h5>
                <p className="card-text">
                  Inicia con un máx de 10 personas. Conceptos básicos de
                  alimentación equilibrada.
                </p>
              </div>
              <div
                className="card-footer"
                style={{ backgroundColor: "rgb(75, 69, 69)" }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      <div className="container my-5">
        <h3 className="text-center mb-4">Clinica nutricional - Ubicación</h3>
        <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.4842975702304!2d-70.56321642345249!3d-33.514792000811696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d1a7b50737a3%3A0xf6b03b7d1e53c8dd!2sProvidencia%205431%2C%20La%20Florida%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1788224883382!5m2!1ses!2scl"
            style={{ border: "0" }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  );
}

export default Main;