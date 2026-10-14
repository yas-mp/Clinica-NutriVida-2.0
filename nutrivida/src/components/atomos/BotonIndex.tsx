import { Link } from "react-router-dom"

function BotonIndex(){
    return(
        <Link to={`/index`}
        className="navbar-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </Link>
    )
}

export default BotonIndex