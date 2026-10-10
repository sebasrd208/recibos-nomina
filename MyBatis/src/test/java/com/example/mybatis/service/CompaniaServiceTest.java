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
public class CompaniaServiceTest {

    @Mock
    MapeoGeneral mapeo;

    @InjectMocks
    private CompaniaService service;

    @Test
    void obtenerCompanias_debeRetornarLista() {

        CompaniaDTO compania1 = new CompaniaDTO();
        CompaniaDTO compania2 = new CompaniaDTO();

        List<CompaniaDTO> companias =
                List.of(compania1, compania2);

        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", companias);

            return null;

        }).when(mapeo).SP_GETCOMPANIA(anyMap());


        List<CompaniaDTO> resultado =
                service.obtenerCompanias();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());

        assertSame(compania1, resultado.get(0));
        assertSame(compania2, resultado.get(1));

        verify(mapeo).SP_GETCOMPANIA(anyMap());
    }

    @Test
    void insertarCompania_debeEnviarParametrosCorrectos() {

        CompaniaDTO dto = new CompaniaDTO();

        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setRfc("PEPJ800101ABC");
        dto.setCompania("Empresa SA");
        dto.setNota("Prueba");
        dto.setTrimestre("T1");

        service.insertarCompania(dto);

        verify(mapeo).SP_SETCOMPANIA(
                argThat(params ->
                        "Juan".equals(
                                params.get("PA_NOMBRE")
                        )
                        &&
                        "Perez".equals(
                                params.get("PA_APELLIDO")
                        )
                        &&
                        "PEPJ800101ABC".equals(
                                params.get("PA_RFC")
                        )
                        &&
                        "Empresa SA".equals(
                                params.get("PA_EMPRESA")
                        )
                        &&
                        "Prueba".equals(
                                params.get("PA_NOTA")
                        )
                        &&
                        "T1".equals(
                                params.get("PA_TRIMESTRE")
                        )
                )
        );
    }

    @Test
    void insertarCompania_debeConvertirDataAccessException() {

        CompaniaDTO dto = new CompaniaDTO();

        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setRfc("PEPJ800101ABC");
        dto.setCompania("Empresa SA");
        dto.setNota("Prueba");
        dto.setTrimestre("T1");


        RuntimeException causa =
                new RuntimeException("Error Oracle");

        DataAccessResourceFailureException exception =
                new DataAccessResourceFailureException(
                        "Error al insertar compañía",
                        causa
                );

        doThrow(exception)
                .when(mapeo)
                .SP_SETCOMPANIA(anyMap());

        RuntimeException resultado =
                assertThrows(
                        RuntimeException.class,
                        () -> service.insertarCompania(dto)
                );

        assertEquals(
                "Error Oracle",
                resultado.getMessage()
        );
    }

    @Test
    void obtenerEmpleados_debeRetornarCompania() {
        CompaniaDTO compania = new CompaniaDTO();

        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put(
                    "rec_cursor",
                    List.of(compania)
            );
            return null;

        }).when(mapeo).SP_GETNUMEMPLEADO(anyMap());

        CompaniaDTO resultado =
                service.obtenerEmpleados("12345");

        assertNotNull(resultado);
        assertSame(compania, resultado);

        verify(mapeo).SP_GETNUMEMPLEADO(
                argThat(params ->
                        "12345".equals(params.get("PA_EMPLEADO"))
                )
        );
    }
}
