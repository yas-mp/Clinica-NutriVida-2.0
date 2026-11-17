
interface BotonProps{
    label: string;
    onClick?: () => void;
    tipo?: "button" | "submit";
    className?: string;
    disabled?: boolean;

}

function Boton({label, onClick, tipo,className, disabled} : BotonProps){
    return(
        <button type={tipo}
        onClick={onClick}
        className={className}
        disabled={disabled}
        >
            {label}
        </button>
    );
}
export default Boton