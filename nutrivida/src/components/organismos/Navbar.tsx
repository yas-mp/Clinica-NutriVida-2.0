import { Link } from "react-router-dom";

function Navbar(){
    return(
    <div>     
        <header>    
            <nav className="navbar navbar-expand-lg navCustom">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                    Nutrivida
                    </Link>
                    <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav mx-auto">
                            
                            <li className="nav-item">
                                <Link className="nav-link-active"
                                aria-current="page" to={""}>Nosotros</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link-active"
                                aria-current="page" to={""}>Profesionales</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link-active"
                                aria-current="page" to={""}>Contáctanos</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link-active"
                                aria-current="page" to={""}>Servicios</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link-active"
                                aria-current="page" to={""}>Blog</Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <Link className="btn btn-succes btn-sm" to={""} style={{borderRadius: '15px'}}
                            >Mi portal</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header> 
    </div>       
    )
}

export default Navbar