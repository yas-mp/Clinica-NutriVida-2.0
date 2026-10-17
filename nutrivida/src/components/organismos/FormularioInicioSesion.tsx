import { useState } from "react";

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
    }
}