import FormularioContacto from "../components/organismos/FormularioContacto";

function Contacto() {
  return (
    <div className="container my-5">
      <div 
        className="card border-0 shadow-lg mx-auto p-3 p-md-4" 
        style={{ maxWidth: '650px', borderRadius: '16px' }}
      >
        <h2 className="text-center fw-bold mt-2 mb-4" style={{ color: '#2e7d32' }}>
          Formulario de Contacto
        </h2>

        <div className="card-body">
          <FormularioContacto />
        </div>
      </div>
    </div>
  );
}

export default Contacto;