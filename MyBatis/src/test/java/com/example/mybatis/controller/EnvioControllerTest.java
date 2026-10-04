package com.example.mybatis.controller;

import com.example.mybatis.dto.EnvioDTO;
import com.example.mybatis.dto.ResultadoEnvioDTO;
import com.example.mybatis.service.EnvioService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnvioControllerTest {

    @Mock
    EnvioService servicio;

    @Mock
    HttpServletResponse response;

    @InjectMocks
    EnvioController controller;

    @Test
    void enviarCorreosPendientes_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("No se pudo enviar el correo")
        );

        doThrow(exception)
                .when(servicio)
                .procesoEnvioCorreos();

        ResponseEntity<?> respuesta =
                controller.enviarCorreosPendientes();

        assertEquals(
                HttpStatus.BAD_REQUEST,
                respuesta.getStatusCode()
        );

        assertEquals(
                "No se pudo enviar el correo",
                respuesta.getBody()
        );

        verify(servicio).procesoEnvioCorreos();
    }

    @Test
    void enviarCorreosPendientes_debeRetornarOk() {

        ResultadoEnvioDTO resultado = new ResultadoEnvioDTO();

        when(servicio.procesoEnvioCorreos())
                .thenReturn(resultado);

        ResponseEntity<?> respuesta =
                controller.enviarCorreosPendientes();

        assertEquals(
                HttpStatus.OK,
                respuesta.getStatusCode()
        );

        assertEquals(
                resultado,
                respuesta.getBody()
        );

        verify(servicio).procesoEnvioCorreos();
    }

    @Test
    void generarPdfSueldo_debeRetornarOkYConfigurarRespuesta() throws Exception {

        String numEmpleado = "12345";
        byte[] pdfBytes = "PDF DE PRUEBA".getBytes();

        ServletOutputStream outputStream = mock(ServletOutputStream.class);

        when(servicio.generatePdfSueldoNeto(numEmpleado))
                .thenReturn(pdfBytes);

        when(response.getOutputStream())
                .thenReturn(outputStream);

        ResponseEntity<?> respuesta =
                controller.generarPdfSueldo(numEmpleado, response);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());

        verify(response).setContentType("application/pdf");

        verify(response).setHeader(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"Recibo_" + numEmpleado + ".pdf\""
        );

        verify(outputStream).write(pdfBytes);
        verify(outputStream).flush();

        verify(servicio).generatePdfSueldoNeto(numEmpleado);
    }

    @Test
    void generarPdfSueldo_debeRetornarNotFoundSiPdfEsNull() throws Exception {

        String numEmpleado = "12345";

        when(servicio.generatePdfSueldoNeto(numEmpleado))
                .thenReturn(null);

        ResponseEntity<?> respuesta =
                controller.generarPdfSueldo(numEmpleado, response);

        assertEquals(
                HttpStatus.NOT_FOUND,
                respuesta.getStatusCode()
        );

        assertNull(respuesta.getBody());

        verify(servicio).generatePdfSueldoNeto(numEmpleado);

        verify(response, never()).setContentType(anyString());
        verify(response, never()).getOutputStream();
    }

    @Test
    void generarPdfSueldo_debeRetornarBadRequestSiOcurreError() throws Exception {

        String numEmpleado = "12345";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al generar PDF")
        );

        when(servicio.generatePdfSueldoNeto(numEmpleado))
                .thenThrow(exception);

        ResponseEntity<?> respuesta =
                controller.generarPdfSueldo(numEmpleado, response);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                respuesta.getStatusCode()
        );

        assertEquals(
                "Error al generar PDF",
                respuesta.getBody()
        );

        verify(servicio).generatePdfSueldoNeto(numEmpleado);
    }

    @Test
    void enviarCorreosPorEmpleado_debeRetornarBadRequestSiOcurreError() {

        String numEmpleado = "10055148";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("No se pudo enviar el correo")
        );

        doThrow(exception)
                .when(servicio)
                .procesoEnvioCorreoPorEmpleado(numEmpleado);

        ResponseEntity<?> respuesta =
                controller.enviarCorreosPorEmpleado(numEmpleado);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                respuesta.getStatusCode()
        );

        assertEquals(
                "No se pudo enviar el correo",
                respuesta.getBody()
        );

        verify(servicio).procesoEnvioCorreoPorEmpleado(numEmpleado);
    }

    @Test
    void enviarCorreosPorEmpleado_debeRetornarOk() {

        String numEmpleado = "12345";

        EnvioDTO envio=new EnvioDTO();

        when(servicio.procesoEnvioCorreoPorEmpleado(numEmpleado))
                .thenReturn(envio);

        ResponseEntity<?> respuesta =
                controller.enviarCorreosPorEmpleado(numEmpleado);

        assertEquals(
                HttpStatus.OK,
                respuesta.getStatusCode()
        );

        assertEquals(
                envio,
                respuesta.getBody()
        );

        verify(servicio).procesoEnvioCorreoPorEmpleado(numEmpleado);
    }
}
