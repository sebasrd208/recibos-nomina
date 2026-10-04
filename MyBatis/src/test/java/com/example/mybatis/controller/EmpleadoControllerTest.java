package com.example.mybatis.controller;

import com.example.mybatis.dto.EmpleadoDTO;
import com.example.mybatis.dto.SueldoNetoDTO;
import com.example.mybatis.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
public class EmpleadoControllerTest {

    @Mock
    EmpleadoService service;

    @Mock
    EnvioService serviceE;

    @InjectMocks
    EmpleadoController controller;

    @Test
    void mostrar_debeRetornarListaConStatus200(){
        List<EmpleadoDTO> lista = List.of(new EmpleadoDTO());

        when(service.obtenerEmpleados()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrar();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerEmpleados();

    }

    @Test
    void mostrar_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar empleados")
        );

        when(service.obtenerEmpleados()).thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrar();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar empleados", respuesta.getBody());

        verify(service).obtenerEmpleados();
    }

    @Test
    void mostrarSueldo_debeRetornarSueldoConStatus200() {

        String numEmpleado = "12345";
        SueldoNetoDTO dto = new SueldoNetoDTO();

        when(service.obtenerSueldoCifrado(numEmpleado))
                .thenReturn(dto);

        ResponseEntity<?> respuesta = controller.mostrarSueldo(numEmpleado);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(dto, respuesta.getBody());

        verify(service).obtenerSueldoCifrado(numEmpleado);
    }

    @Test
    void mostrarSueldo_debeRetornarBadRequestSiOcurreError() {

        String numEmpleado = "12345";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Empleado no encontrado")
        );

        when(service.obtenerSueldoCifrado(numEmpleado))
                .thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarSueldo(numEmpleado);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Empleado no encontrado", respuesta.getBody());

        verify(service).obtenerSueldoCifrado(numEmpleado);
    }

    @Test
    void buscar_debeRetornarEmpleadoConStatus200() {

        String numEmpleado = "12345";
        EmpleadoDTO dto = new EmpleadoDTO();

        when(service.byNumEmpleado(numEmpleado))
                .thenReturn(dto);

        ResponseEntity<?> respuesta = controller.buscar(numEmpleado);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(dto, respuesta.getBody());

        verify(service).byNumEmpleado(numEmpleado);
    }

    @Test
    void buscar_debeRetornarBadRequestSiOcurreError() {

        String numEmpleado = "12345";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Empleado no encontrado")
        );

        when(service.byNumEmpleado(numEmpleado))
                .thenThrow(exception);

        ResponseEntity<?> respuesta = controller.buscar(numEmpleado);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Empleado no encontrado", respuesta.getBody());

        verify(service).byNumEmpleado(numEmpleado);
    }

    @Test
    void guardar_debeRetornarCreatedSiInsertaCorrectamente() {

        EmpleadoDTO dto = new EmpleadoDTO();

        doNothing().when(service).insertarEmpleados(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals("{\"Mensaje\":\"Registro exitoso\"}",
                respuesta.getBody());

        verify(service).insertarEmpleados(dto);
    }

    @Test
    void guardar_debeRetornarBadRequestSiOcurreError() {

        EmpleadoDTO dto = new EmpleadoDTO();

        doThrow(new RuntimeException("Error al guardar empleado"))
                .when(service)
                .insertarEmpleados(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al guardar empleado", respuesta.getBody());

        verify(service).insertarEmpleados(dto);
    }

    @Test
    void actualizar_debeRetornarCreatedSiActualizoCorrectamente() {

        EmpleadoDTO dto = new EmpleadoDTO();

        doNothing().when(service).actualizarEmpleados(dto);

        ResponseEntity<?> respuesta = controller.actualizar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals("{\"Mensaje\":\"Actualización exitoso\"}",
                respuesta.getBody());

        verify(service).actualizarEmpleados(dto);
    }

    @Test
    void actualizar_debeRetornarBadRequestSiOcurreError() {

        EmpleadoDTO dto = new EmpleadoDTO();

        doThrow(new RuntimeException("Error al actualizar empleado"))
                .when(service)
                .actualizarEmpleados(dto);

        ResponseEntity<?> respuesta = controller.actualizar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al actualizar empleado", respuesta.getBody());

        verify(service).actualizarEmpleados(dto);
    }

    @Test
    void enviarCorreo_debeRetornarOkSiSeEnvioCorrectamente() {

        String correo = "sebas@gmail.com";
        String nombre = "12345";

        doNothing()
                .when(serviceE)
                .envioCorreoAdjunto(correo, nombre);

        ResponseEntity<String> respuesta =
                controller.enviarCorreo(correo, nombre);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(
                "Correo enviado correctamente a " + correo,
                respuesta.getBody()
        );

        verify(serviceE).envioCorreoAdjunto(correo, nombre);
    }

    @Test
    void enviarCorreo_debeRetornarInternalServerErrorSiOcurreError() {

        String correo = "sebas@gmail.com";
        String nombre = "12345";

        doThrow(new RuntimeException("No se pudo enviar el correo"))
                .when(serviceE)
                .envioCorreoAdjunto(correo, nombre);

        ResponseEntity<String> respuesta =
                controller.enviarCorreo(correo, nombre);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, respuesta.getStatusCode());

        assertEquals(
                "Error al enviar el correo: No se pudo enviar el correo",
                respuesta.getBody()
        );

        verify(serviceE).envioCorreoAdjunto(correo, nombre);
    }
}
