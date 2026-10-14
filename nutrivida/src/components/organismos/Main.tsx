import { Link } from "react-router-dom";
import carruselImagen from "../assets/images/carrusel-imagen.jpg";
import carruselNutri from "../assets/images/carrusel-nutricionista.webp";

function Main(){
    return(
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
                            alt="nutricionista-banner" />
                        <div className="carousel-caption d-none d-md-block">
                            <div
                                className="bg-white text-dark p-4 rounded-4 shadow-lg mx-auto"
                                style={{ maxWidth: '500px', opacity: '0.9' }}
                            >
                                <h2 className="fw-bold text-success">Clinica Nutricional</h2>
                                <p className="fw-bold text-uppercase text-secondary mb-2">
                                    Tú bienestar comienza hoy
                                </p>
                                <p className="mb-3">
                                    Nutrición para recuperar tu salud, mejorar tu bienestar, bajar
                                    de peso y <strong>sentirse mejor.</strong>
                                </p>
                                <Link to={""} className="btn btn-success rounded-pill px-4"
                                >Reservar hora</Link>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img
                            src={carruselNutri}
                            className="d-block w-100"
                            alt="carrusel-nutricionista" />
                        <div className="carousel-caption d-none d-md-block">
                            <div
                                className="bg-white text-dark p-4 rounded-4 shadow-lg mx-auto"
                                style={{ maxWidth: '500px', opacity: '0.9' }}
                            >
                                <h2 className="fw-bold text-success">Clínica Nutricional</h2>
                                <p className="fw-bold text-uppercase text-secondary mb-2"
                                >Tu bienestar comienza hoy
                                </p>

                                <Link to={""} className="btn btn-success rounded-pill px-4"
                                >Reservar hora</Link>
                            </div>
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
        </main>    

    
    )

}

export default Main