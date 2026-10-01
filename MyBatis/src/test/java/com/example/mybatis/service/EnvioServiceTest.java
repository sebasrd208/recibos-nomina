package com.example.mybatis.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import com.example.mybatis.dto.*;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
public class EnvioServiceTest {

    @Mock
    private DocumentoService servicio;

    @Mock
    private JavaMailSender envioCorreo;

    @Mock
    private EmpleadoService service;

    @InjectMocks
    private EnvioService envioService;

    @Test
    void generarPdfBase64_debeConvertirPdfABase64() throws Exception {

        byte[] pdf = "PDF DE PRUEBA".getBytes(StandardCharsets.UTF_8);

        EnvioService spyService = spy(envioService);

        doReturn(pdf)
                .when(spyService)
                .generatePdfSueldoNeto("12345");


        String resultado =
                spyService.generarPdfBase64("12345");


        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());

        verify(spyService)
                .generatePdfSueldoNeto("12345");
    }

    @Test
    void guardarPdfEnBD_debeGuardarDocumentoConStatusUno()
            throws Exception {

        byte[] pdf = "PDF DE PRUEBA".getBytes(StandardCharsets.UTF_8);

        EnvioService spyService = spy(envioService);

        doReturn(pdf)
                .when(spyService)
                .generatePdfSueldoNeto("12345");


        spyService.guardarPdfEnBD("12345");


        ArgumentCaptor<DocumentoDTO> captor =
                ArgumentCaptor.forClass(DocumentoDTO.class);

        verify(servicio).actualizarDocumenctos(
                captor.capture()
        );


        DocumentoDTO dto = captor.getValue();

        assertEquals("12345", dto.getNumEmpleado());
        assertEquals("1", dto.getStatus());
        assertNotNull(dto.getDocumento());
        assertFalse(dto.getDocumento().isEmpty());
    }

    @Test
    void guardarPdfEnBD_debeGuardarStatusDosSiHayError()
            throws Exception {

        EnvioService spyService = spy(envioService);

        doThrow(new RuntimeException("Error PDF"))
                .when(spyService)
                .generatePdfSueldoNeto("12345");


        spyService.guardarPdfEnBD("12345");


        ArgumentCaptor<DocumentoDTO> captor =
                ArgumentCaptor.forClass(DocumentoDTO.class);

        verify(servicio).actualizarDocumenctos(
                captor.capture()
        );


        DocumentoDTO dto = captor.getValue();

        assertEquals("12345", dto.getNumEmpleado());
        assertEquals("2", dto.getStatus());
        assertEquals(
                "No se pudo enviar el documento",
                dto.getDocumento()
        );
    }

    @Test
    void envioCorreoAdjunto_debeEnviarCorreoConPdf()
            throws Exception {

        byte[] pdf = "PDF DE PRUEBA".getBytes(StandardCharsets.UTF_8);
        EnvioService spyService = spy(envioService);

        doReturn(pdf)
                .when(spyService)
                .generatePdfSueldoNeto("12345");


        MimeMessage message =
                new MimeMessage(
                        Session.getInstance(
                                System.getProperties()
                        )
                );

        when(envioCorreo.createMimeMessage())
                .thenReturn(message);


        spyService.envioCorreoAdjunto(
                "correo@correo.com",
                "12345"
        );


        verify(envioCorreo).createMimeMessage();
        verify(envioCorreo).send(message);
    }

    @Test
    void envioCorreoAdjunto_debeLanzarExceptionSiFalla()
            throws Exception {

        EnvioService spyService = spy(envioService);

        doThrow(new RuntimeException("Error PDF"))
                .when(spyService)
                .generatePdfSueldoNeto("12345");


        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> spyService.envioCorreoAdjunto(
                                "correo@correo.com",
                                "12345"
                        )
                );


        assertEquals(
                "No se pudo generar el PDF para: 12345",
                exception.getMessage()
        );
    }

    @Test
    void procesoEnvioCorreos_debeRegistrarCorreosEnviados(){

        DocumentoDTO doc1 = new DocumentoDTO();
        doc1.setNumEmpleado("100");
        doc1.setCorreo("uno@correo.com");

        DocumentoDTO doc2 = new DocumentoDTO();
        doc2.setNumEmpleado("200");
        doc2.setCorreo("dos@correo.com");

        when(servicio.obtenerStatus())
                .thenReturn(List.of(doc1, doc2));

        EnvioService spyService = spy(envioService);

        doNothing()
                .when(spyService)
                .guardarPdfEnBD(anyString());

        doNothing()
                .when(spyService)
                .envioCorreoAdjunto(
                        anyString(),
                        anyString()
                );

        ResultadoEnvioDTO resultado =
                spyService.procesoEnvioCorreos();


        assertEquals(
                2,
                resultado.getTotalEnviados()
        );

        assertEquals(
                0,
                resultado.getTotalFallidos()
        );

        assertEquals(
                List.of(
                        "uno@correo.com",
                        "dos@correo.com"
                ),
                resultado.getCorreosEnviados()
        );

        assertTrue(
                resultado.getCorreosFallidos().isEmpty()
        );

        assertTrue(
                resultado.getTiempoEjecucionMs() >= 0
        );
    }

    @Test
    void procesoEnvioCorreos_debeRegistrarCorreoFallido(){

        DocumentoDTO doc = new DocumentoDTO();

        doc.setNumEmpleado("100");
        doc.setCorreo("fallido@correo.com");

        when(servicio.obtenerStatus())
                .thenReturn(List.of(doc));

        EnvioService spyService = spy(envioService);

        doNothing()
                .when(spyService)
                .guardarPdfEnBD(anyString());

        doThrow(new RuntimeException("Error correo"))
                .when(spyService)
                .envioCorreoAdjunto(
                        anyString(),
                        anyString()
                );

        ResultadoEnvioDTO resultado =
                spyService.procesoEnvioCorreos();

        assertEquals(
                0,
                resultado.getTotalEnviados()
        );

        assertEquals(
                1,
                resultado.getTotalFallidos()
        );

        assertTrue(
                resultado.getCorreosEnviados().isEmpty()
        );

        assertEquals(
                List.of("fallido@correo.com"),
                resultado.getCorreosFallidos()
        );
    }

    @Test
    void procesoEnvioCorreoPorEmpleado_debeEnviarCorreo(){

        DocumentoDTO doc = new DocumentoDTO();

        doc.setCorreo("empleado@correo.com");
        doc.setNumEmpleado("12345");

        when(servicio.obtenerPorNumEmpleado("12345"))
                .thenReturn(doc);

        EnvioService spyService = spy(envioService);

        doNothing()
                .when(spyService)
                .guardarPdfEnBD("12345");

        doNothing()
                .when(spyService)
                .envioCorreoAdjunto(
                        "empleado@correo.com",
                        "12345"
                );

        EnvioDTO resultado =
                spyService.procesoEnvioCorreoPorEmpleado(
                        "12345"
                );

        assertEquals(
                "12345",
                resultado.getNumEmpleado()
        );

        assertEquals(
                "empleado@correo.com",
                resultado.getCorreoEnviado()
        );

        assertTrue(
                resultado.getTiempoEjecucionMs() >= 0
        );
    }

    @Test
    void procesoEnvioCorreoPorEmpleado_debeLanzarExceptionSiNoExiste(){

        when(servicio.obtenerPorNumEmpleado("99999"))
                .thenReturn(null);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> envioService
                                .procesoEnvioCorreoPorEmpleado(
                                        "99999"
                                )
                );

        assertEquals(
                "Error procesando empleado: 99999",
                exception.getMessage()
        );

        verify(servicio)
                .obtenerPorNumEmpleado("99999");
    }

    @Test
    void generatePdfSueldoNeto_debeRetornarNullSiNoExisteSueldo()
            throws Exception {

        when(service.obtenerSueldo("12345"))
                .thenReturn(null);

        byte[] resultado =
                envioService.generatePdfSueldoNeto("12345");

        assertNull(resultado);

        verify(service)
                .obtenerSueldo("12345");
    }
}
