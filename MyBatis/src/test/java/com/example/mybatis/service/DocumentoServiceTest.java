package com.example.mybatis.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import com.example.mybatis.dto.*;
import com.example.mybatis.mappers.MapeoGeneral;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;

@ExtendWith(MockitoExtension.class)
public class DocumentoServiceTest {

    @Mock
    MapeoGeneral mapeo;

    @InjectMocks
    private DocumentoService service;

    @Test
    void obtenerDocumentos_debeRetornarLista() {

        DocumentoDTO documento1 = new DocumentoDTO();
        DocumentoDTO documento2 = new DocumentoDTO();

        List<DocumentoDTO> documentos =
                List.of(documento1, documento2);

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", documentos);

            return null;

        }).when(mapeo).SP_GETDOCUMENTOS(anyMap());


        List<DocumentoDTO> resultado =
                service.obtenerDocumentos();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());

        assertSame(documento1, resultado.get(0));
        assertSame(documento2, resultado.get(1));

        verify(mapeo).SP_GETDOCUMENTOS(anyMap());
    }

    @Test
    void obtenerStatus_debeRetornarLista() {

        DocumentoDTO documento1 = new DocumentoDTO();
        DocumentoDTO documento2 = new DocumentoDTO();

        List<DocumentoDTO> documentos =
                List.of(documento1, documento2);

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", documentos);

            return null;

        }).when(mapeo).SP_GETSTATUS(anyMap());


        List<DocumentoDTO> resultado =
                service.obtenerStatus();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());

        assertSame(documento1, resultado.get(0));
        assertSame(documento2, resultado.get(1));

        verify(mapeo).SP_GETSTATUS(anyMap());
    }

    @Test
    void obtenerPorNumEmpleado_debeRetornarDocumento() {

        DocumentoDTO documento = new DocumentoDTO();

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put(
                    "rec_cursor",
                    List.of(documento)
            );

            return null;

        }).when(mapeo).SP_GET_STATUS_EMPLEADO(anyMap());


        DocumentoDTO resultado =
                service.obtenerPorNumEmpleado("12345");


        assertNotNull(resultado);
        assertSame(documento, resultado);

        verify(mapeo).SP_GET_STATUS_EMPLEADO(
                argThat(params ->
                        "12345".equals(
                                params.get("PA_EMPLEADO")
                        )
                )
        );
    }

    @Test
    void byNumEmpleado_debeRetornarDocumento() {

        DocumentoDTO documento = new DocumentoDTO();

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put(
                    "rec_cursor",
                    List.of(documento)
            );

            return null;

        }).when(mapeo).SP_GETDOCUMENTO(anyMap());


        DocumentoDTO resultado =
                service.byNumEmpleado("12345");


        assertNotNull(resultado);
        assertSame(documento, resultado);

        verify(mapeo).SP_GETDOCUMENTO(
                argThat(params ->
                        "12345".equals(
                                params.get("PA_EMPLEADO")
                        )
                )
        );
    }

    @Test
    void obtenerStatusUno_debeRetornarLista() {

        DocumentoDTO documento1 = new DocumentoDTO();
        DocumentoDTO documento2 = new DocumentoDTO();

        List<DocumentoDTO> documentos =
                List.of(documento1, documento2);

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", documentos);

            return null;

        }).when(mapeo).SP_GETSTATUS_UNO(anyMap());


        List<DocumentoDTO> resultado =
                service.obtenerStatusUno();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());

        assertSame(documento1, resultado.get(0));
        assertSame(documento2, resultado.get(1));

        verify(mapeo).SP_GETSTATUS_UNO(anyMap());
    }

    @Test
    void obtenerStatusDos_debeRetornarLista() {

        DocumentoDTO documento1 = new DocumentoDTO();
        DocumentoDTO documento2 = new DocumentoDTO();

        List<DocumentoDTO> documentos =
                List.of(documento1, documento2);

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", documentos);

            return null;

        }).when(mapeo).SP_GETSTATUS_DOS(anyMap());


        List<DocumentoDTO> resultado =
                service.obtenerStatusDos();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());

        assertSame(documento1, resultado.get(0));
        assertSame(documento2, resultado.get(1));

        verify(mapeo).SP_GETSTATUS_DOS(anyMap());
    }

    @Test
    void insertarDocumenctos_debeEnviarParametrosCorrectos() {

        DocumentoDTO dto = new DocumentoDTO();

        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setCorreo("juan@correo.com");
        dto.setStatus("1");

        service.insertarDocumenctos(dto);

        verify(mapeo).SP_SETDOCUMENTOS(
                argThat(params ->
                        "Juan".equals(
                                params.get("PA_NOMBRE")
                        )
                        &&
                        "Perez".equals(
                                params.get("PA_APELLIDO")
                        )
                        &&
                        "juan@correo.com".equals(
                                params.get("PA_CORREO")
                        )
                        &&
                        "1".equals(
                                params.get("PA_STATUS")
                        )
                )
        );
    }

    @Test
    void insertarDocumenctos_debeConvertirDataAccessException() {

        DocumentoDTO dto = new DocumentoDTO();

        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setCorreo("juan@correo.com");
        dto.setStatus("1");

        RuntimeException causa =
                new RuntimeException("Error Oracle");

        DataAccessResourceFailureException exception =
                new DataAccessResourceFailureException(
                        "Error al insertar documento",
                        causa
                );

        doThrow(exception)
                .when(mapeo)
                .SP_SETDOCUMENTOS(anyMap());

        RuntimeException resultado =
                assertThrows(
                        RuntimeException.class,
                        () -> service.insertarDocumenctos(dto)
                );

        assertEquals(
                "Error Oracle",
                resultado.getMessage()
        );
    }

    @Test
    void actualizarDocumenctos_debeEnviarParametrosCorrectos() {

        DocumentoDTO dto = new DocumentoDTO();

        dto.setNumEmpleado("12345");
        dto.setDocumento("recibo.pdf");
        dto.setStatus("2");

        service.actualizarDocumenctos(dto);

        verify(mapeo).SP_UPDTDOCUMENTOS(
                argThat(params ->
                        "12345".equals(
                                params.get("PA_EMPLEADO")
                        )
                        &&
                        "recibo.pdf".equals(
                                params.get("PA_DOCUMENT")
                        )
                        &&
                        "2".equals(
                                params.get("PA_STATUS")
                        )
                )
        );
    }

    @Test
    void actualizarDocumenctos_debeConvertirDataAccessException() {

        DocumentoDTO dto = new DocumentoDTO();

        dto.setNumEmpleado("12345");
        dto.setDocumento("recibo.pdf");
        dto.setStatus("2");

        RuntimeException causa =
                new RuntimeException("Error Oracle");

        DataAccessResourceFailureException exception =
                new DataAccessResourceFailureException(
                        "Error al actualizar documento",
                        causa
                );

        doThrow(exception)
                .when(mapeo)
                .SP_UPDTDOCUMENTOS(anyMap());

        RuntimeException resultado =
                assertThrows(
                        RuntimeException.class,
                        () -> service.actualizarDocumenctos(dto)
                );

        assertEquals(
                "Error Oracle",
                resultado.getMessage()
        );
    }
}
