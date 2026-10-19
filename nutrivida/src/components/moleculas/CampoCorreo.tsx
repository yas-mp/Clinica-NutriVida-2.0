import Input from "../atomos/Input";

type CorreoProps = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    placeHolder?: string;
    valor: string,
     maxLength?: number | string;
    alCambiar: (valor:string) => void;
}

function CampoCorreo({etiqueta, tipo, nombre, valor, alCambiar} : CorreoProps){
    return(
        <div className="mb-3">
            <label htmlFor="correo" className="form-label fw-bold">
                {etiqueta}
            </label>
            <Input
            tipo={tipo}
            nombre={nombre}
            className="form-control"
            placeholder="ejemplo@correo.cl"
            valor={valor}
            alCambiar={alCambiar}
            />
        </div>
    )

}
export default CampoCorreo