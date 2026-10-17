import Input from "../atomos/Input";

type ContrasenaProps = {
    id?: string;
    valor: string;
    relleno?: string;
    alCambiar: (valor:string) => void;
}

function CampoContrasena({id = "clave", valor, relleno="****", alCambiar} : ContrasenaProps){
    return(
        <div className="mb-3">
            <label htmlFor="clave" className="form-label fw-bold" >
                Contraseña:
                </label>
                <Input 
                tipo="password"
                id={id}
                maxLength={4}
                valor={valor}
                placeholder={relleno}
                alCambiar={alCambiar}
                />
        </div>
    )
}
export default CampoContrasena