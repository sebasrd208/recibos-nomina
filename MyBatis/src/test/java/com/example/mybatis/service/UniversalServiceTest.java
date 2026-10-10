package com.example.mybatis.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import com.example.mybatis.dto.*;
import com.example.mybatis.mappers.MapeoGeneral;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;

@ExtendWith(MockitoExtension.class)
public class UniversalServiceTest {

    @Mock
    MapeoGeneral mapeo;

    @InjectMocks
    UniversalService service;

    @Test
    void insertar_debeEnviarParametrosCorrectos() {

        UniversalDTO dto = new UniversalDTO();
        dto.setApellido("Perez");
        dto.setNombre("Juan");
        dto.setNumEmpleado("12345");

        service.insertar(dto);

        verify(mapeo).SP_UNIVERSAL(argThat(params ->
                "Perez".equals(params.get("PA_APELLIDO")) &&
                        "Juan".equals(params.get("PA_NOMBRE")) &&
                        "12345".equals(params.get("PA_EMPLEADO"))
        ));
    }

    @Test
    void insertar_debeLanzarRuntimeExceptionSiFallaMapper() {

        UniversalDTO dto = new UniversalDTO();
        dto.setApellido("Perez");
        dto.setNombre("Juan");
        dto.setNumEmpleado("12345");

        DataAccessException exception =
                new DataAccessResourceFailureException(
                        "ORA-20003: EL NUMERO DE EMPLEADO YA EXISTE",
                        new RuntimeException("Error al insertar empleado")
                );

        doThrow(exception)
                .when(mapeo)
                .SP_UNIVERSAL(anyMap());

        RuntimeException resultado = assertThrows(
                RuntimeException.class,
                () -> service.insertar(dto)
        );

        assertEquals("Error al insertar empleado", resultado.getMessage());
    }

    @Test
    void borradoUniversal_debeEnviarNumeroEmpleadoCorrecto() {

        String numEmpleado = "12345";

        service.borradoUniversal(numEmpleado);

        verify(mapeo).SP_BORRADO_UNIVERSAL(argThat(params ->
                "12345".equals(params.get("PA_EMPLEADO"))
        ));
    }

    @Test
    void borradoUniversal_debeLanzarRuntimeExceptionSiFallaMapper() {

        DataAccessException exception =
                new DataAccessResourceFailureException(
                        "ORA-20003: NO HAY DATOS DISPONIBLES",
                        new RuntimeException("Error al borrar empleado")
                );

        doThrow(exception)
                .when(mapeo)
                .SP_BORRADO_UNIVERSAL(anyMap());

        RuntimeException resultado = assertThrows(
                RuntimeException.class,
                () -> service.borradoUniversal("12345")
        );

        assertEquals("Error al borrar empleado", resultado.getMessage());
    }
}
