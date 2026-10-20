type Props = {
    tipo: string;
    id?: string,
    className?: string,
    nombre?: string;
    valor: string;
    maxLength?: number | string;
    placeholder?: string;
    alCambiar: (valor:string) => void;
}

function Input({tipo, id,className,nombre, valor, maxLength, placeholder, alCambiar} : Props){
    return(
        <input
        type={tipo}
        id={id}
        className={className}
        name={nombre}
        value={valor}
        maxLength={Number(maxLength)}
        placeholder={placeholder}
        onChange={(e) => alCambiar(e.target.value)}
        style={{ backgroundColor: "#ffffff", color: "#212529" }}
        >
        </input>
    );
}
export default Input;