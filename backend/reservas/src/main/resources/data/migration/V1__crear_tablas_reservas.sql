CREATE TABLE reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut_paciente VARCHAR(15) NOT NULL,
    servicio VARCHAR(120) NOT NULL,
    profesional VARCHAR(120) NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    recordatorio_enviado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);