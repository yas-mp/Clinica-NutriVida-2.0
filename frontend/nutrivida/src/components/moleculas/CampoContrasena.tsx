import Input from "../atomos/Input";

type ContrasenaProps = {
    etiqueta?: string;
    tipo: string;
    nombre: string;
    placeHolder?: string;
    valor: string;
    alCambiar: (valor:string) => void;
}

function CampoContrasena({etiqueta, tipo, nombre, valor, alCambiar} : ContrasenaProps){
    return(
        <div className="mb-3">
            <label htmlFor="clave" className="form-label fw-bold" >
                {etiqueta}
                </label>
                <Input 
                tipo={tipo}
                nombre={nombre}
                placeholder="****"
                valor={valor}
                alCambiar={alCambiar}
                />
        </div>
    )
}
export default CampoContrasena