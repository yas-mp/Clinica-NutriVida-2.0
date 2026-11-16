CREATE TABLE fichas_clinicas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut_paciente VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    peso_kg DOUBLE NOT NULL,
    talla_cm DOUBLE NOT NULL,
    cintura_cm DOUBLE NOT NULL,
    imc DOUBLE NOT NULL,
    plan_alimenticio TEXT NOT NULL,
    observaciones TEXT NULL,
    nutricionista VARCHAR(150) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO fichas_clinicas (
    rut_paciente,
    fecha,
    peso_kg,
    talla_cm,
    cintura_cm,
    imc,
    plan_alimenticio,
    observaciones,
    nutricionista
) VALUES (
    '188663338',
    '2026-11-14',
    68.5,
    165.0,
    78.5,
    25.2,
    'Pauta hipocalórica balanceada de 1800 kcal distribuida en 4 comidas diarias',
    'Control inicial de prueba cargado por Flyway',
    'Camila Soto'
);