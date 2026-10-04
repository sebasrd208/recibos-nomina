package com.example.mybatis.controller;

import com.example.mybatis.dto.UniversalDTO;
import com.example.mybatis.service.UniversalService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UniversalControllerTest {

    @Mock
    UniversalService service;

    @InjectMocks
    UniversalController controller;

    @Test
    void guardar_debeRetornarCreatedSiInsertaCorrectamente() {

        UniversalDTO dto = new UniversalDTO();

        doNothing().when(service).insertar(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Registro exitoso\"}",
                respuesta.getBody()
        );

        verify(service).insertar(dto);
    }

    @Test
    void guardar_debeRetornarBadRequestSiOcurreError() {

        UniversalDTO dto = new UniversalDTO();

        doThrow(new RuntimeException("Error al guardar empleado"))
                .when(service)
                .insertar(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al guardar empleado", respuesta.getBody());

        verify(service).insertar(dto);
    }

    @Test
    void eliminar_debeRetornarCreatedSiSeEliminoCorrectamente() {
        String numEmpleado = "10055148";

        doNothing().when(service).borradoUniversal(numEmpleado);

        ResponseEntity<?> respuesta = controller.borradoUniversal(numEmpleado);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Borrado exitoso\"}",
                respuesta.getBody()
        );

        verify(service).borradoUniversal(numEmpleado);
    }

    @Test
    void eliminar_debeRetornarBadRequestSiOcurreError() {
        String numEmpleado = "123456";

        doThrow(new RuntimeException("Error al eliminar empleado"))
                .when(service)
                .borradoUniversal(numEmpleado);

        ResponseEntity<?> respuesta = controller.borradoUniversal(numEmpleado);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al eliminar empleado", respuesta.getBody());

        verify(service).borradoUniversal(numEmpleado);
    }
}
