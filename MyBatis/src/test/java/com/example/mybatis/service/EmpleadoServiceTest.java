package com.example.mybatis.service;

import com.example.mybatis.dto.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import javax.crypto.SecretKey;
import com.example.mybatis.mappers.MapeoGeneral;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;

@ExtendWith(MockitoExtension.class)
public class EmpleadoServiceTest {

    @Mock
    MapeoGeneral mapeoGeneral;

    @Mock
    private SecretKey secretKey;

    @InjectMocks
    private EmpleadoService service;

    @Test
    void obtenerSueldo_debeRetornarEmpleado() {
        SueldoNetoDTO empleado = new SueldoNetoDTO();
        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", List.of(empleado));
            return null;
        }).when(mapeoGeneral).SP_GET_EMPLEADO(anyMap());

        SueldoNetoDTO resultado =
                service.obtenerSueldo("12345");

        assertNotNull(resultado);
        assertSame(empleado, resultado);
        verify(mapeoGeneral).SP_GET_EMPLEADO(
                argThat(params ->
                        "12345".equals(params.get("PA_EMPLEADO"))
                )
        );
    }

    @Test
    void obtenerSueldoCifrado_debeRetornarEmpleadoCifrado() {
        SueldoNetoDTO empleado = spy(new SueldoNetoDTO());
        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", List.of(empleado));
            return null;
        }).when(mapeoGeneral).SP_GET_EMPLEADO(anyMap());

        SueldoNetoDTO resultado =
                service.obtenerSueldoCifrado("12345");

        assertNotNull(resultado);
        assertSame(empleado, resultado);
        verify(empleado).encryptFields(secretKey);
        verify(mapeoGeneral).SP_GET_EMPLEADO(
                argThat(params ->
                        "12345".equals(params.get("PA_EMPLEADO"))
                )
        );
    }

    @Test
    void obtenerEmpleados_debeRetornarListaDeEmpleados() {

        EmpleadoDTO empleado1 = new EmpleadoDTO();
        EmpleadoDTO empleado2 = new EmpleadoDTO();

        List<EmpleadoDTO> empleados =
                List.of(empleado1, empleado2);


        doAnswer(invocation -> {

            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", empleados);

            return null;

        }).when(mapeoGeneral).SP_GETEMPLEADO(anyMap());


        List<EmpleadoDTO> resultado =
                service.obtenerEmpleados();


        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertSame(empleado1, resultado.get(0));
        assertSame(empleado2, resultado.get(1));

        verify(mapeoGeneral).SP_GETEMPLEADO(anyMap());
    }

    @Test
    void byNumEmpleado_debeRetornarEmpleado() {
        EmpleadoDTO empleado = new EmpleadoDTO();
        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", List.of(empleado));
            return null;
        }).when(mapeoGeneral).SP_GETEMPLOYEE(anyMap());

        EmpleadoDTO resultado =
                service.byNumEmpleado("12345");

        assertNotNull(resultado);
        assertSame(empleado, resultado);
        verify(mapeoGeneral).SP_GETEMPLOYEE(
                argThat(params ->
                        "12345".equals(params.get("PA_EMPLEADO"))
                )
        );
    }

    @Test
    void insertarEmpleados_debeLlamarAlMapperConParametrosCorrectos() {

        EmpleadoDTO dto = new EmpleadoDTO();

        dto.setTelefono("2221234567");
        dto.setApellido("Perez");
        dto.setNombre("Juan");
        dto.setSeccion("Sistemas");
        dto.setSueldo("15000");

        doNothing()
                .when(mapeoGeneral)
                .SP_INSERT_EMPLEADOS(anyMap());

        service.insertarEmpleados(dto);

        verify(mapeoGeneral).SP_INSERT_EMPLEADOS(
                argThat(params ->
                        "2221234567".equals(params.get("PA_TELEFONO"))
                                && "Perez".equals(params.get("PA_APELLIDO"))
                                && "Juan".equals(params.get("PA_NOMBRE"))
                                && "Sistemas".equals(params.get("PA_SECCION"))
                                && "15000".equals(params.get("PA_SUELDO"))
                )
        );
    }

    @Test
    void insertarEmpleados_debeLanzarRuntimeExceptionSiOracleFalla() {

        EmpleadoDTO dto = new EmpleadoDTO();

        dto.setTelefono("2221234567");
        dto.setApellido("Perez");
        dto.setNombre("Juan");
        dto.setSeccion("Sistemas");
        dto.setSueldo("15000");

        RuntimeException causa =
                new RuntimeException("Error al insertar empleado");

        DataAccessException exception =
                new DataAccessResourceFailureException(
                        "Error Oracle",
                        causa
                );

        doThrow(exception)
                .when(mapeoGeneral)
                .SP_INSERT_EMPLEADOS(anyMap());

        RuntimeException resultado = assertThrows(
                RuntimeException.class,
                () -> service.insertarEmpleados(dto)
        );

        assertEquals(
                "Error al insertar empleado",
                resultado.getMessage()
        );
    }

    @Test
    void actualizarEmpleados_debeLlamarAlMapperConParametrosCorrectos() {

        EmpleadoDTO dto = new EmpleadoDTO();

        dto.setIdEmpleado(10);
        dto.setSeccion("Recursos Humanos");
        dto.setSueldo("18000");

        doNothing()
                .when(mapeoGeneral)
                .SP_UPDATE_EMPLEADO(anyMap());

        service.actualizarEmpleados(dto);

        verify(mapeoGeneral).SP_UPDATE_EMPLEADO(
                argThat(params ->
                        Integer.valueOf(10).equals(params.get("PA_ID"))
                                && "Recursos Humanos"
                                .equals(params.get("PA_SECCION"))
                                && "18000".equals(params.get("PA_SUELDO"))
                )
        );
    }


    @Test
    void actualizarEmpleados_debeLanzarRuntimeExceptionSiOracleFalla() {

        EmpleadoDTO dto = new EmpleadoDTO();

        dto.setIdEmpleado(10);
        dto.setSeccion("Sistemas");
        dto.setSueldo("18000");

        RuntimeException causa =
                new RuntimeException("Error al actualizar empleado");

        DataAccessException exception =
                new DataAccessResourceFailureException(
                        "Error Oracle",
                        causa
                );

        doThrow(exception)
                .when(mapeoGeneral)
                .SP_UPDATE_EMPLEADO(anyMap());

        RuntimeException resultado = assertThrows(
                RuntimeException.class,
                () -> service.actualizarEmpleados(dto)
        );

        assertEquals(
                "Error al actualizar empleado",
                resultado.getMessage()
        );
    }
}
