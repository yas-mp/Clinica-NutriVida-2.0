function Nosotros() {
  return (
    <div className="container my-5" style={{ maxWidth: "1000px" }}>
      {/* Encabezado Principal */}
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "#2e7d32" }}>
          Sobre NutriVida
        </h1>
        <p className="lead text-muted">
          Acompañándote hacia un estilo de vida más saludable y equilibrado.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h3 className="fw-bold text-center mb-3" style={{ color: "#1e5631" }}>
              Quiénes somos
            </h3>
            <p className="text-secondary lh-base mb-0" style={{ textAlign: "left" }}>
              Somos una clínica de nutrición y dietética que opera desde 2016 en la comuna de Temuco, en la Región de la Araucanía. Atendemos a pacientes con distintos objetivos como la pérdida de peso, control de enfermedades metabólicas, nutrición deportiva y alimentación vegetariana o vegana.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h3 className="fw-bold text-center mb-3" style={{ color: "#1e5631" }}>
              Nuestra visión
            </h3>
            <p className="text-secondary lh-base mb-0" style={{ textAlign: "left" }}>
              Ser la clínica nutricional líder en atención digital y presencial, destacando por la calidad profesional y el compromiso con la salud comunitaria.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 pt-3">
        <h2 className="fw-bold mb-2" style={{ color: "#2e7d32" }}>
          Equipo Desarrollador
        </h2>
        <p className="text-muted mb-4">
          Proyecto desarrollado para la asignatura Fullstack II
        </p>

        <div className="row justify-content-center g-3">
          <div className="col-sm-5 col-md-4">
            <div className="card border-0 shadow-sm p-3 bg-light" style={{ borderRadius: "12px" }}>
              <h5 className="fw-bold mb-1 text-dark">Yasna Mora</h5>
              <small className="text-muted">Desarrolladora Frontend</small>
            </div>
          </div>
          <div className="col-sm-5 col-md-4">
            <div className="card border-0 shadow-sm p-3 bg-light" style={{ borderRadius: "12px" }}>
              <h5 className="fw-bold mb-1 text-dark">Diego Rivas</h5>
              <small className="text-muted">Desarrollador Fullstack</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;