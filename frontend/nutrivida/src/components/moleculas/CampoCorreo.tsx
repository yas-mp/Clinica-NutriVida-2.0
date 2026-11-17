import Input from "../atomos/Input";

type CorreoProps = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    placeHolder?: string;
    valor: string;
    maxLength?: number;
    alCambiar: (valor:string) => void;
}

function CampoCorreo({etiqueta, tipo, nombre, placeHolder, valor, maxLength, alCambiar} : CorreoProps){
    return(
        <div className="mb-3">
            <label htmlFor={nombre} className="form-label d-block">
                {etiqueta}
            </label>
            <Input
            tipo={tipo}
            nombre={nombre}
            className="form-control"
            placeholder={placeHolder}
            valor={valor}
            maxLength={maxLength}
            alCambiar={alCambiar}
            />
        </div>
    )

}
export default CampoCorreo
