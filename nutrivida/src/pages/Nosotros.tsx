import DevCard from "../components/atomos/DevCard";
import SeccionHeader from "../components/atomos/SeccionHeader";

function Nosotros(){
    return(
        <main className="container my-5">
            <SeccionHeader titulo = "Sobre Nutrivida" subtitulo="Acompañándote hacia un estilo de vida más saludable y equilibrado.">
            </SeccionHeader>
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0">
                        <h3 className="text-success fw-bold text-center">Quiénes somos</h3>
                        <p style={{textAlign: 'justify'}}>
                            Somos una clínica de nutrición y dietética que opera desde 2016 en
                            la comuna de Temuco, en la Región de la Araucanía. Atendemos a
                            pacientes con distintos objetivos como la pérdida de peso, control
                            de enfermedades metabólicas, nutrición deportiva y alimentación
                            vegetariana o vegana.
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0">
                        <h3 className="text-success fw-bold text-center">Nuestra visión</h3>
                        <p style={{textAlign: 'justify'}}>
                            Ser la clínica nutricional líder en atención digital y presencial,
                            destacando por la calidad profesional y el compromiso con la salud
                            comunitaria.
                        </p>
                    </div>
                </div>
            </div>
            <section className="mt-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success">Equipo Desarrollador</h2>
                        <p className="text-muted">
                        Proyecto desarrollado para la asignatura Fullstack II
                        </p>
                </div>
                <DevCard nombre = "Yasna Mora" rol= "Desarrollador Frontend"></DevCard>
                <DevCard nombre = "Diego Rivas" rol= "Desarrollador Fullstack"></DevCard>
            </section>    
        </main>
    )
}
export default Nosotros;