import FormularioContacto from "../components/organismos/FormularioContacto";

function Contacto(){

    return(
        <div className="card mx-auto" style={{maxWidth: '450px', marginTop: '20px'}}>
            <h2 style={{textAlign: 'center', marginTop: '10px', borderBottom: '3px solid #2a492a'}}>
                Formulario de contacto
            </h2>
            <div className="card-body">
                <FormularioContacto/>
            </div>
        </div>
    )
}
export default Contacto