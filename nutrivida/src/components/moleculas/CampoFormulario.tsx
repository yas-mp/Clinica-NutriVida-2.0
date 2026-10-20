import Input from "../atomos/Input";

type CampoFormularioProps = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    placeholder?: string;
    valor: string;
    maxLength?: number | string;
    alCambiar: (valor:string) => void;
}

function CampoFormulario({etiqueta, tipo, nombre, valor, alCambiar} : CampoFormularioProps){
    return(
        <div className="col-12">
            <label htmlFor={nombre} className="form-label d-block">
                {etiqueta}
            </label>
            <Input 
            tipo={tipo}
            className="form-control"
            nombre={nombre}
            valor={valor}
            alCambiar={alCambiar}
            
            />
        </div>
    )
}
export default CampoFormulario