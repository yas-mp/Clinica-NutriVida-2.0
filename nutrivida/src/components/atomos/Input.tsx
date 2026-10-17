type Props = {
    tipo: string;
    id?: string,
    nombre?: string;
    valor: string;
    maxLength?: number | string;
    placeholder: string;
    alCambiar: (valor:string) => void;
}

function Input({tipo, id,nombre, valor, maxLength, placeholder, alCambiar} : Props){
    return(
        <input
        type={tipo}
        id={id}
        name={nombre}
        className="form-control"
        value={valor}
        placeholder={placeholder}
        maxLength={Number(maxLength)}
        onChange={(e) => alCambiar(e.target.value)}
        >
        </input>
    );
}
export default Input;