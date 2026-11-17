type Props = {
    tipo: string;
    id?: string,
    className?: string,
    nombre?: string;
    valor: string;
    placeholder?: string;
    maxLength?: number;
    alCambiar: (valor:string) => void;
}

function Input({tipo, id,className,nombre, valor, placeholder, maxLength, alCambiar} : Props){
    return(
        <input
        type={tipo}
        id={id || nombre}
        className={className}
        name={nombre}
        value={valor}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => alCambiar(e.target.value)}
        style={{ backgroundColor: "#ffffff", color: "#212529" }}
        >
        </input>
    );
}
export default Input;