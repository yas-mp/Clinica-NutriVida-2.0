CREATE TABLE contactos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NULL,
    asunto VARCHAR(150) NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    respuesta TEXT NULL,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta DATETIME NULL
);

INSERT INTO contactos (
    nombre,
    correo,
    telefono,
    asunto,
    mensaje,
    leido,
    estado,
    respuesta,
    fecha_envio,
    fecha_respuesta
) VALUES
(
    'Juan Alejandro Pérez Romero',
    'juan.perez@correo.cl',
    '+56912345678',
    'Consulta por planes nutricionales',
    'Hola, quisiera saber si atienden pacientes con planes vegetarianos y cuáles son los valores de la primera consulta.',
    FALSE,
    'Pendiente',
    NULL,
    '2026-11-15 09:15:00',
    NULL
),
(
    'María Fernanda González',
    'maria.gonzalez@correo.cl',
    '+56987654321',
    'Solicitud de hora',
    'Buenos días, necesito agendar una hora con la nutricionista Camila Soto para la próxima semana.',
    TRUE,
    'Leído',
    NULL,
    '2026-11-14 16:40:00',
    NULL
),
(
    'Carlos Andrés Muñoz',
    'carlos.munoz@correo.cl',
    '+56955554444',
    'Consulta sobre horarios de atención',
    'Quisiera saber si tienen atención los días sábado en la mañana y si cuentan con modalidad online.',
    TRUE,
    'Respondido',
    'Hola Carlos, sí tenemos atención los sábados hasta las 13:00 horas y también contamos con modalidad online. Saludos.',
    '2026-11-13 11:05:00',
    '2026-11-13 15:30:00'
),
(
    'Fernanda Rojas Silva',
    'fernanda.rojas@correo.cl',
    NULL,
    'Consulta general',
    'Me gustaría recibir información sobre los programas de control de peso y sus duraciones.',
    FALSE,
    'Pendiente',
    NULL,
    '2026-11-16 08:20:00',
    NULL
);
