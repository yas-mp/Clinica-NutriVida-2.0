import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import CampoCorreo from "../moleculas/CampoCorreo";
import Boton from "../atomos/Boton";

function FormularioContacto(){
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [comentarios, setComentarios] = useState("")

    const manejarEnvioFormulario = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(nombre === "" || correo === "" || comentarios === "" ){
            alert("Debe completar todos los campos")
            return
        }


        if(nombre === ""){
            alert("El nombre no debe estar vacío")
            return;
        }

        if(nombre.length > 100){
            alert("El nombre no puede superar los 100 carácteres")
            return;
        }

        if(comentarios.length > 500){
            alert("El comentario no puede superar los 500 carácteres")
            return;
        }

        alert("Formulario enviado correctamente")

        setNombre("")
        setCorreo("")
        setComentarios("")
    }    
    return(
        <form className="row g-3" onSubmit={manejarEnvioFormulario} noValidate>
            <div className="col-12">
                <CampoFormulario
                etiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                placeholder="Juan Alejandro Peréz Romero"
                valor={nombre}
                maxLength={100}
                alCambiar={setNombre}
                />
            </div>    

            <div className="col-12">
                <CampoCorreo
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                maxLength={100}
                alCambiar={setCorreo}
                />
            </div>    
                
            <div className="col-12">
                <CampoFormulario
                etiqueta="Comentarios"
                tipo="text"
                nombre="comentarios"
                placeholder="Máximo 500 carácteres"
                valor={comentarios}
                maxLength={500}
                alCambiar={setComentarios}
                />
            </div>

            <div className="col-12">
                <Boton 
                label= "Enviar formulario" 
                tipo="submit" 
                className="btn btn-success d-block mx-auto"
                />
            </div>

        </form>
    );
}

export default FormularioContacto