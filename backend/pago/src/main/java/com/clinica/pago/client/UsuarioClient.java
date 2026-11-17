package com.clinica.pago.client;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.clinica.pago.client.dto.UsuarioRemotoDTO;

@Component
public class UsuarioClient {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioClient.class);

    private final RestClient restClient;
    private final boolean fallarSiNoResponde;

    public UsuarioClient(
            @Value("${pago.usuarios.url:http://localhost:8081}") String baseUrl,
            @Value("${pago.usuarios.connect-timeout-ms:2000}") long connectTimeoutMs,
            @Value("${pago.usuarios.read-timeout-ms:3000}") long readTimeoutMs,
            @Value("${pago.usuarios.fallar-si-no-responde:false}") boolean fallarSiNoResponde) {

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(connectTimeoutMs));
        requestFactory.setReadTimeout(Duration.ofMillis(readTimeoutMs));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
        this.fallarSiNoResponde = fallarSiNoResponde;

        logger.info("Cliente de usuarios configurado con URL base: {}", baseUrl);
    }

    /**
     * Valida que el usuario exista en el microservicio de usuarios.
     *
     * @param usuarioId identificador del usuario a validar (puede ser nulo)
     * @throws RuntimeException si el usuario no existe o si el servicio no
     *         responde y la validación estricta está habilitada
     */
    public void validarExistencia(Long usuarioId) {
        if (usuarioId == null) {
            return;
        }

        try {
            UsuarioRemotoDTO usuario = restClient.get()
                    .uri("/api/usuarios/{id}", usuarioId)
                    .retrieve()
                    .body(UsuarioRemotoDTO.class);

            if (usuario == null || usuario.getId() == null) {
                throw new RuntimeException("Usuario no encontrado con ID: " + usuarioId);
            }

            logger.debug("Usuario validado correctamente: ID={} correo={}", usuario.getId(), usuario.getCorreo());
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 404) {
                throw new RuntimeException("Usuario no encontrado con ID: " + usuarioId);
            }
            manejarServicioNoDisponible(usuarioId, ex);
        } catch (ResourceAccessException ex) {
            manejarServicioNoDisponible(usuarioId, ex);
        }
    }

    private void manejarServicioNoDisponible(Long usuarioId, Exception ex) {
        String mensaje = "No fue posible validar el usuario con ID " + usuarioId
                + " contra el microservicio de usuarios";

        if (fallarSiNoResponde) {
            throw new RuntimeException(mensaje + ": " + ex.getMessage(), ex);
        }

        logger.warn("{}; el pago se registrará de todas formas. Detalle: {}", mensaje, ex.getMessage());
    }
}
