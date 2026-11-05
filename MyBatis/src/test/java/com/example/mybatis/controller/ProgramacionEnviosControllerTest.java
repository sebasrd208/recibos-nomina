package com.example.mybatis.controller;

import org.mockito.Mock;
import java.util.Locale;
import org.mockito.InjectMocks;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.verify;
import java.time.format.DateTimeFormatter;
import static org.mockito.Mockito.doThrow;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.dto.ProgramarEnvioDTO;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import com.example.mybatis.service.EnvioRecibosProgramador;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class ProgramacionEnviosControllerTest {

    @Mock
    EnvioRecibosProgramador recibosProgramador;

    @InjectMocks
    ProgramacionEnviosController controller;

    DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm:ss a", Locale.US);

    @Test
    void programarEnvio_debeRetornarOkSiProgramaCorrectamente() {

        ProgramarEnvioDTO dto = new ProgramarEnvioDTO();
        dto.setNumEmpleado("12345");
        dto.setFechaHora(LocalDateTime.of(2026, 11, 10, 15, 30, 0));

        String fechaFormateada = dto.getFechaHora().format(formatter);

        ResponseEntity<?> respuesta = controller.programarEnvio(dto);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(
                "Envío programado correctamente para " + fechaFormateada,
                respuesta.getBody()
        );

        verify(recibosProgramador).programarEnvio(
                dto.getNumEmpleado(),
                dto.getFechaHora()
        );
    }

    @Test
    void programarEnvio_debeRetornarBadRequestSiLaFechaEsPasada() {

        ProgramarEnvioDTO dto = new ProgramarEnvioDTO();
        dto.setNumEmpleado("12345");
        dto.setFechaHora(LocalDateTime.now().minusDays(1));

        doThrow(new IllegalArgumentException(
                "La fecha debe ser posterior a la fecha actual"
        )).when(recibosProgramador).programarEnvio(
                dto.getNumEmpleado(),
                dto.getFechaHora()
        );

        ResponseEntity<?> respuesta = controller.programarEnvio(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals(
                "La fecha debe ser posterior a la fecha actual",
                respuesta.getBody()
        );

        verify(recibosProgramador).programarEnvio(
                dto.getNumEmpleado(),
                dto.getFechaHora()
        );
    }

    @Test
    void programarEnvio_debeRetornarBadRequestSiOcurreUnError() {

        ProgramarEnvioDTO dto = new ProgramarEnvioDTO();
        dto.setNumEmpleado("12345");
        dto.setFechaHora(LocalDateTime.of(2026, 11, 10, 15, 30, 0));

        doThrow(new RuntimeException("Error al programar el envío"))
                .when(recibosProgramador)
                .programarEnvio(dto.getNumEmpleado(), dto.getFechaHora());

        ResponseEntity<?> respuesta = controller.programarEnvio(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al programar el envío", respuesta.getBody());

        verify(recibosProgramador).programarEnvio(
                dto.getNumEmpleado(),
                dto.getFechaHora()
        );
    }

    @Test
    void programarEnvioMasivo_debeRetornarOkSiProgramaCorrectamente() {

        LocalDateTime fechaHora =
                LocalDateTime.of(2026, 11, 10, 15, 30, 0);

        String fechaFormateada = fechaHora.format(formatter);

        ResponseEntity<String> respuesta =
                controller.programarEnvioMasivo(fechaHora);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(
                "Envío masivo programado correctamente para " + fechaFormateada,
                respuesta.getBody()
        );

        verify(recibosProgramador).programarEnvioMasivo(fechaHora);
    }

    @Test
    void programarEnvioMasivo_debeRetornarBadRequestSiLaFechaEsPasada() {

        LocalDateTime fechaPasada = LocalDateTime.now().minusDays(1);

        doThrow(new IllegalArgumentException(
                "La fecha debe ser después de la actual"
        )).when(recibosProgramador).programarEnvioMasivo(fechaPasada);

        ResponseEntity<String> respuesta =
                controller.programarEnvioMasivo(fechaPasada);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals(
                "La fecha debe ser después de la actual",
                respuesta.getBody()
        );

        verify(recibosProgramador).programarEnvioMasivo(fechaPasada);
    }

    @Test
    void programarEnvioMasivo_debeRetornarBadRequestSiOcurreUnError() {

        LocalDateTime fechaHora =
                LocalDateTime.of(2026, 11, 10, 15, 30, 0);

        doThrow(new RuntimeException("Error al programar el envío masivo"))
                .when(recibosProgramador)
                .programarEnvioMasivo(fechaHora);

        ResponseEntity<String> respuesta =
                controller.programarEnvioMasivo(fechaHora);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals(
                "Error al programar el envío masivo",
                respuesta.getBody()
        );

        verify(recibosProgramador).programarEnvioMasivo(fechaHora);
    }

}
