interface DevCardProps {
    nombre: string,
    rol: string
}

function DevCard({nombre, rol} : DevCardProps){
    return(
        <div className="row justify-content-center g-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm border-0 text-center">
              <h5 className="fw-bold m-0 text-dark">{nombre}</h5>
              <small className="text-muted">{rol}</small>
            </div>
          </div>
        </div>
    )

}

export default DevCard