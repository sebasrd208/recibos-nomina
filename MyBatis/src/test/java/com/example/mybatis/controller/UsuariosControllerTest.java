package com.example.mybatis.controller;

import com.example.mybatis.dto.Rol;
import com.example.mybatis.dto.UsuariosDTO;
import com.example.mybatis.service.UsuariosService;
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
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UsuariosControllerTest {

    @Mock
    UsuariosService service;

    @InjectMocks
    UsuariosController controller;

    @Test
    void guardar_debeRetornarCreatedSiInsertaCorrectamente() {

        UsuariosDTO dto = new UsuariosDTO();

        doNothing().when(service).insertarUsuarios(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Registro exitoso\"}",
                respuesta.getBody()
        );

        verify(service).insertarUsuarios(dto);
    }

    @Test
    void guardar_debeRetornarBadRequestSiOcurreError() {

        UsuariosDTO dto = new UsuariosDTO();

        doThrow(new RuntimeException("Error al guardar usuario"))
                .when(service)
                .insertarUsuarios(dto);

        ResponseEntity<?> respuesta = controller.guardar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al guardar usuario", respuesta.getBody());

        verify(service).insertarUsuarios(dto);
    }

    @Test
    void editar_debeRetornarCreatedSiActualizoCorrectamente() {

        UsuariosDTO dto = new UsuariosDTO();

        doNothing().when(service).actualizarUsuarios(dto);

        ResponseEntity<?> respuesta = controller.editar(dto);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Actualización exitosa\"}",
                respuesta.getBody()
        );

        verify(service).actualizarUsuarios(dto);
    }

    @Test
    void editar_debeRetornarBadRequestSiOcurreError() {

        UsuariosDTO dto = new UsuariosDTO();

        doThrow(new RuntimeException("Error al actualizar usuario"))
                .when(service)
                .actualizarUsuarios(dto);

        ResponseEntity<?> respuesta = controller.editar(dto);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al actualizar usuario", respuesta.getBody());

        verify(service).actualizarUsuarios(dto);
    }

    @Test
    void actualizarPassword_debeRetornarCreatedSiActualizoPasswordCorrectamente() {

        String username="Sebastián", password="249901";
        doNothing().when(service).actualizarPassword(username, password);

        ResponseEntity<?> respuesta = controller.actualizarPassword(username, password);
        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Se actualizó la contraseña del usuario "+username+"\"}",
                respuesta.getBody()
        );

        verify(service).actualizarPassword(username, password);
    }

    @Test
    void actualizarPassword_debeRetornarBadRequestSiOcurreError() {

        String username="Sebastián", password="249901";

        doThrow(new RuntimeException("Error al actualizar usuario"))
                .when(service)
                .actualizarPassword(username, password);

        ResponseEntity<?> respuesta = controller.actualizarPassword(username, password);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al actualizar usuario", respuesta.getBody());

        verify(service).actualizarPassword(username, password);
    }

    @Test
    void mostrarUsuario_debeRetornarBadRequestSiOcurreError() {

        String usuario = "Sebastián";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Usuario no encontrado")
        );

        when(service.obtenerUsuario(usuario))
                .thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarUsuario(usuario);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Usuario no encontrado", respuesta.getBody());

        verify(service).obtenerUsuario(usuario);
    }

    @Test
    void mostrarUsuario_debeRetornarUsuarioConStatus200() {

        UsuariosDTO dto=new UsuariosDTO();
        String usuario = "Erick";

        when(service.obtenerUsuario(usuario))
                .thenReturn(dto);

        ResponseEntity<?> respuesta = controller.mostrarUsuario(usuario);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(dto, respuesta.getBody());

        verify(service).obtenerUsuario(usuario);
    }

    @Test
    void mostrarUsuarios_debeRetornarListaConStatus200() {

        List<UsuariosDTO> lista = List.of(new UsuariosDTO());
        when(service.obtenerUsuarios()).thenReturn(lista);

        ResponseEntity<?> respuesta = controller.mostrarUsuarios();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(lista, respuesta.getBody());

        verify(service).obtenerUsuarios();
    }

    @Test
    void mostrarUsuarios_debeRetornarBadRequestSiOcurreError() {

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar usuarios")
        );

        when(service.obtenerUsuarios()).thenThrow(exception);

        ResponseEntity<?> respuesta = controller.mostrarUsuarios();

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al consultar usuarios", respuesta.getBody());

        verify(service).obtenerUsuarios();
    }

    @Test
    void login_debeRetornarOkSiCredencialesSonCorrectas() {

        String usuario = "Sebastian", password = "249901";

        UsuariosDTO usuarioDTO = new UsuariosDTO();
        usuarioDTO.setUsuario("Sebastian");
        usuarioDTO.setRol(Rol.ADMIN);

        when(service.login("Sebastian", "249901"))
                .thenReturn(usuarioDTO);

        ResponseEntity<?> respuesta =
                controller.login(usuario, password);

        assertEquals(
                HttpStatus.OK,
                respuesta.getStatusCode()
        );

        assertEquals(
                usuarioDTO,
                respuesta.getBody()
        );

        verify(service).login("Sebastian", "249901");
    }

    @Test
    void login_debeRetornarUnauthorizedSiCredencialesSonIncorrectas() {

        String usuario = "Sebastian", password = "incorrecta";

        when(service.login("Sebastian", "incorrecta"))
                .thenReturn(null);

        ResponseEntity<?> respuesta =
                controller.login(usuario, password);

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                respuesta.getStatusCode()
        );

        assertEquals(
                "Usuario o contraseña incorrectos",
                respuesta.getBody()
        );

        verify(service).login("Sebastian", "incorrecta");
    }

    @Test
    void login_debeRetornarUnauthorizedSiOcurreError() {

        String usuario = "Sebastian", password = "123456";

        RuntimeException exception = new RuntimeException(
                new RuntimeException("Error al consultar usuario")
        );

        when(service.login("Sebastian", "123456"))
                .thenThrow(exception);

        ResponseEntity<?> respuesta =
                controller.login(usuario, password);

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                respuesta.getStatusCode()
        );

        assertEquals(
                "Error al consultar usuario",
                respuesta.getBody()
        );

        verify(service).login("Sebastian", "123456");
    }

    @Test
    void eliminar_debeRetornarCreatedSiSeEliminoCorrectamente() {
        String username = "Mikari";

        doNothing().when(service).borrarUsuario(username);

        ResponseEntity<?> respuesta = controller.eliminar(username);

        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(
                "{\"Mensaje\":\"Usuario eliminado de manera exitosa\"}",
                respuesta.getBody()
        );

        verify(service).borrarUsuario(username);
    }

    @Test
    void eliminar_debeRetornarBadRequestSiOcurreError() {
        String username = "Alfonso";

        doThrow(new RuntimeException("Error al eliminar usuario"))
                .when(service)
                .borrarUsuario(username);

        ResponseEntity<?> respuesta = controller.eliminar(username);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        assertEquals("Error al eliminar usuario", respuesta.getBody());

        verify(service).borrarUsuario(username);
    }
}
