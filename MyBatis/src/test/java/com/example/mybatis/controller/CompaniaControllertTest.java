package com.example.mybatis.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import com.example.mybatis.dto.*;
import com.example.mybatis.service.CompaniaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
public class CompaniaControllertTest {

    @Mock
    CompaniaService servicio;

    @InjectMocks
    CompaniaController controller;

    @Test
    void mostrarCompanias_debeRetornarListaConStatus200() {

        List<CompaniaDTO> lista = List.of(new CompaniaDTO());
        when(servicio.obtenerCompanias()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrarCompanias();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(servicio).obtenerCompanias();
    }

    @Test
    void mostrarCompanias_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar compañías")
        );

        when(servicio.obtenerCompanias()).thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarCompanias();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar compañías", respuesta.getBody());

        verify(servicio).obtenerCompanias();
    }

    @Test
    void guardar_debeRetornarCreatedSiInsertaCorrectamente() {

        CompaniaDTO dto = new CompaniaDTO();

        doNothing().when(servicio).insertarCompania(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Registro exitoso\"}",
                respuesta.getBody()
        );

        verify(servicio).insertarCompania(dto);
    }

    @Test
    void guardar_debeRetornarBadRequestSiOcurreError() {

        CompaniaDTO dto = new CompaniaDTO();

        doThrow(new RuntimeException("Error al guardar compañía"))
                .when(servicio)
                .insertarCompania(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al guardar compañía", respuesta.getBody());

        verify(servicio).insertarCompania(dto);
    }

    @Test
    void mostrarEmpresa_debeRetornarBadRequestSiOcurreError() {

        String numEmpleado = "12345";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Empleado no encontrado")
        );

        when(servicio.obtenerEmpleados(numEmpleado))
                .thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarEmpresa(numEmpleado);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Empleado no encontrado", respuesta.getBody());

        verify(servicio).obtenerEmpleados(numEmpleado);
    }

    @Test
    void mostrarEmpresa_debeRetornarCompaniaConStatus200() {

        String numEmpleado = "12345";
        CompaniaDTO dto = new CompaniaDTO();

        when(servicio.obtenerEmpleados(numEmpleado))
                .thenReturn(dto);

        ResponseEntity<?> respuesta = controller.mostrarEmpresa(numEmpleado);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(dto, respuesta.getBody());

        verify(servicio).obtenerEmpleados(numEmpleado);
    }
}
