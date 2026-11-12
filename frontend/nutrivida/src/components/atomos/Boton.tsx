
interface BotonProps{
    label: string;
    onClick?: () => void;
    tipo?: "button" | "submit";
    className?: string;

}

function Boton({label, onClick, tipo,className} : BotonProps){
    return(
        <button type={tipo}
        onClick={onClick}
        className={className}
        >
            {label}
        </button>
    );
}
export default Boton