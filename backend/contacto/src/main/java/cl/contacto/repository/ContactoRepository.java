package cl.contacto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.contacto.model.Contacto;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    List<Contacto> findAllByOrderByFechaEnvioDesc();

    List<Contacto> findByLeidoFalseOrderByFechaEnvioDesc();

    List<Contacto> findByEstadoIgnoreCaseOrderByFechaEnvioDesc(String estado);
}
