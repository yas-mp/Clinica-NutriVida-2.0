type Props = {
    tipo: string;
    id?: string,
    className?: string,
    nombre?: string;
    valor: string;
    placeholder?: string;
    alCambiar: (valor:string) => void;
}

function Input({tipo, id,className,nombre, valor, placeholder, alCambiar} : Props){
    return(
        <input
        type={tipo}
        id={id || nombre}
        className={className}
        name={nombre}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => alCambiar(e.target.value)}
        style={{ backgroundColor: "#ffffff", color: "#212529" }}
        >
        </input>
    );
}
export default Input;