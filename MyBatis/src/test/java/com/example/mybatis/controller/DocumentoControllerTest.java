package com.example.mybatis.controller;

import com.example.mybatis.dto.*;
import com.example.mybatis.service.DocumentoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DocumentoControllerTest {

    @Mock
    DocumentoService service;

    @InjectMocks
    DocumentoController controller;

    @Test
    void mostrarDocumentos_debeRetornarListaConStatus200(){
        List<DocumentoDTO> lista = List.of(new DocumentoDTO());

        when(service.obtenerDocumentos()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrarDocumentos();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerDocumentos();

    }

    @Test
    void mostrarDocumentos_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar documentos")
        );

        when(service.obtenerDocumentos()).thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarDocumentos();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar documentos", respuesta.getBody());

        verify(service).obtenerDocumentos();
    }

    @Test
    void mostrarStatus_debeRetornarListaConStatus200() {

        List<DocumentoDTO> lista = List.of(new DocumentoDTO());
        when(service.obtenerStatus()).thenReturn(lista);
        ResponseEntity<?> respuesta = controller.mostrarStatus();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerStatus();
    }

    @Test
    void mostrarStatus_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar status de documentos")
        );

        when(service.obtenerStatus()).thenThrow(exception);
        ResponseEntity<?> respuesta = controller.mostrarStatus();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar status de documentos", respuesta.getBody());

        verify(service).obtenerStatus();
    }

    @Test
    void mostrarStatusUno_debeRetornarListaConStatus200() {

        List<DocumentoDTO> lista = List.of(new DocumentoDTO());
        when(service.obtenerStatusUno()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrarStatusUno();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerStatusUno();
    }

    @Test
    void mostrarStatusUno_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar status 1 de documentos")
        );

        when(service.obtenerStatusUno()).thenThrow(exception);
        ResponseEntity<?> respuesta = controller.mostrarStatusUno();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar status 1 de documentos", respuesta.getBody());

        verify(service).obtenerStatusUno();
    }

    @Test
    void mostrarStatusDos_debeRetornarListaConStatus200() {

        List<DocumentoDTO> lista = List.of(new DocumentoDTO());
        when(service.obtenerStatusDos()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrarStatusDos();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerStatusDos();
    }

    @Test
    void mostrarStatusDos_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar status 2 de documentos")
        );

        when(service.obtenerStatusDos()).thenThrow(exception);
        ResponseEntity<?> respuesta = controller.mostrarStatusDos();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar status 2 de documentos", respuesta.getBody());

        verify(service).obtenerStatusDos();
    }

    @Test
    void guardar_debeRetornarCreatedSiInsertaCorrectamente() {

        DocumentoDTO dto = new DocumentoDTO();

        doNothing().when(service).insertarDocumenctos(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals("{\"Mensaje\":\"Registro exitoso\"}",
                respuesta.getBody());

        verify(service).insertarDocumenctos(dto);
    }

    @Test
    void guardar_debeRetornarBadRequestSiOcurreError() {

        DocumentoDTO dto = new DocumentoDTO();

        doThrow(new RuntimeException("Error al guardar documento"))
                .when(service)
                .insertarDocumenctos(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al guardar documento", respuesta.getBody());

        verify(service).insertarDocumenctos(dto);
    }

    @Test
    void buscar_debeRetornarBadRequestSiOcurreError() {

        String numEmpleado = "12345";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Documento no encontrado")
        );

        when(service.byNumEmpleado(numEmpleado))
                .thenThrow(exception);

        ResponseEntity<?> respuesta = controller.buscar(numEmpleado);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Documento no encontrado", respuesta.getBody());

        verify(service).byNumEmpleado(numEmpleado);
    }

    @Test
    void buscar_debeRetornarCompaniaConStatus200() {

        String numEmpleado = "12345";
        DocumentoDTO dto = new DocumentoDTO();

        when(service.byNumEmpleado(numEmpleado))
                .thenReturn(dto);

        ResponseEntity<?> respuesta = controller.buscar(numEmpleado);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(dto, respuesta.getBody());

        verify(service).byNumEmpleado(numEmpleado);
    }
}
