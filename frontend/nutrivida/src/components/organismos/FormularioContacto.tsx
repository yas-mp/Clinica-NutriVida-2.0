import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import CampoCorreo from "../moleculas/CampoCorreo";
import Boton from "../atomos/Boton";
import { enviarMensajeContacto, obtenerMensajeError } from "../../services/contactoService";

type ErroresFormulario = {
    nombre?: string;
    correo?: string;
    mensaje?: string;
};

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormularioContacto(){
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [errores, setErrores] = useState<ErroresFormulario>({})
    const [enviando, setEnviando] = useState(false)
    const [envioExitoso, setEnvioExitoso] = useState<string | null>(null)
    const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

    const validarFormulario = (): ErroresFormulario => {
        const nuevosErrores: ErroresFormulario = {}
        const nombreLimpio = nombre.trim()
        const correoLimpio = correo.trim()
        const mensajeLimpio = mensaje.trim()

        if(nombreLimpio === ""){
            nuevosErrores.nombre = "El nombre no debe estar vacío"
        } else if(nombreLimpio.length > 100){
            nuevosErrores.nombre = "El nombre no puede superar los 100 caracteres"
        }

        if(correoLimpio === ""){
            nuevosErrores.correo = "El correo electrónico es obligatorio"
        } else if(!CORREO_VALIDO.test(correoLimpio)){
            nuevosErrores.correo = "Ingresa un correo electrónico válido"
        } else if(correoLimpio.length > 100){
            nuevosErrores.correo = "El correo no puede superar los 100 caracteres"
        }

        if(mensajeLimpio === ""){
            nuevosErrores.mensaje = "El comentario no debe estar vacío"
        } else if(mensajeLimpio.length > 500){
            nuevosErrores.mensaje = "El comentario no puede superar los 500 caracteres"
        }

        return nuevosErrores
    }

    const manejarEnvioFormulario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEnvioExitoso(null)
        setErrorEnvio(null)

        const nuevosErrores = validarFormulario()
        setErrores(nuevosErrores)

        if(Object.keys(nuevosErrores).length > 0){
            return
        }

        setEnviando(true)

        try {
            await enviarMensajeContacto({
                nombre: nombre.trim(),
                correo: correo.trim().toLowerCase(),
                mensaje: mensaje.trim(),
            })

            setEnvioExitoso("¡Mensaje enviado correctamente! Nos pondremos en contacto a la brevedad.")
            setNombre("")
            setCorreo("")
            setMensaje("")
        } catch (error) {
            setErrorEnvio(obtenerMensajeError(error))
        } finally {
            setEnviando(false)
        }
    }    

    return(
        <form className="row g-3" onSubmit={manejarEnvioFormulario} noValidate>
            {envioExitoso && (
                <div className="col-12">
                    <div className="alert alert-success mb-0" role="status">
                        {envioExitoso}
                    </div>
                </div>
            )}

            {errorEnvio && (
                <div className="col-12">
                    <div className="alert alert-danger mb-0" role="alert">
                        {errorEnvio}
                    </div>
                </div>
            )}

            <div className="col-12">
                <CampoFormulario
                etiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                placeholder="Juan Alejandro Pérez Romero"
                valor={nombre}
                maxLength={100}
                alCambiar={setNombre}
                />
                {errores.nombre && (
                    <p className="text-danger small mb-0 mt-1" role="alert">
                        {errores.nombre}
                    </p>
                )}
            </div>    

            <div className="col-12">
                <CampoCorreo
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                placeHolder="juan@gmail.com"
                valor={correo}
                maxLength={100}
                alCambiar={setCorreo}
                />
                {errores.correo && (
                    <p className="text-danger small mb-0 mt-1" role="alert">
                        {errores.correo}
                    </p>
                )}
            </div>    
                
            <div className="col-12">
                <label htmlFor="comentarios" className="form-label fw-bold">
                    Comentarios
                </label>
                <textarea
                    id="comentarios"
                    name="comentarios"
                    className="form-control"
                    rows={5}
                    placeholder="Máximo 500 caracteres"
                    value={mensaje}
                    maxLength={500}
                    onChange={(e) => setMensaje(e.target.value)}
                    style={{ resize: "vertical" }}
                />
                <p className="form-text text-end mb-0">{mensaje.length}/500</p>
                {errores.mensaje && (
                    <p className="text-danger small mb-0 mt-1" role="alert">
                        {errores.mensaje}
                    </p>
                )}
            </div>

            <div className="col-12">
                <Boton 
                label={enviando ? "Enviando..." : "Enviar formulario"}
                tipo="submit" 
                className="btn btn-success d-block mx-auto"
                disabled={enviando}
                />
            </div>

        </form>
    );
}

export default FormularioContacto
