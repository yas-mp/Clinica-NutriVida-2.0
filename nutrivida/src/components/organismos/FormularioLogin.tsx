import { useState } from "react";
import CampoCorreo from "../moleculas/CampoCorreo";
import CampoContrasena from "../moleculas/CampoContrasena";
import Boton from "../atomos/Boton";
import { Link } from "react-router-dom";

function FormularioInicioSesion(){
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")

    const manejarEnvio = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(correo.trim() === ""){
            alert("Debe ingresar un correo")
            return;
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
            alert("Ingresa un correo válido")
            return;
        }

        if(contrasena.trim() === ""){
            alert("Debe ingresar una contrasena")
            return;
        }

        if(contrasena.length > 4 ){
            alert("La contraseña debe tener exactamente 4 carácteres")
            return;
        }

    }

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <div className="inicioSesion">
                <div className="login">
                    <h1>Iniciar sesión</h1>
                        
                        <CampoCorreo
                        etiqueta="Correo electrónico"
                        tipo="email"
                        nombre="correo"
                        valor={correo}
                        alCambiar={setCorreo}/>

                        <CampoContrasena
                        etiqueta="Contraseña"
                        tipo="pass"
                        nombre="clave"
                        valor={contrasena}
                        alCambiar={setContrasena}
                        />

                        <Boton label= "Ingresar" tipo="submit" className="btn btn-success w-100 fw-bold mb-3"
                        />

                        <div className="text-center mt-3">
                            <span className="text-muted" style={{marginTop: '10px', textAlign: 'center'}}
                            >¿No tienes una cuenta?
                            </span><br />
                            <Link to={"/"} className="fw-bold text-decoration-none" style={{color: "#2a492a"}}
                            >Regístrate aquí
                            </Link>
                        </div>
                </div>
            </div>
        </form>
    );
}

export default FormularioInicioSesion