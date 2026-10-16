interface SeccionHeaderDrops{
    titulo: string,
    subtitulo: string
}

function SeccionHeader({titulo, subtitulo} : SeccionHeaderDrops){
    return(
        <section className="mt-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-succes">{titulo}</h2>
                <p className="text-muted">
                    {subtitulo}
                </p>
            </div>
        </section>
    )
}
export default SeccionHeader