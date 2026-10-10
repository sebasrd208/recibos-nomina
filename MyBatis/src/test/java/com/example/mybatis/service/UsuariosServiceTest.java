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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class UsuariosServiceTest {

    @Mock
    MapeoGeneral mapeo;

    @Mock
    PasswordEncoder encoder;

    @InjectMocks
    UsuariosService service;

    @Test
    void obtenerUsuario_debeRetornarUsuarioEncontrado() {

        UsuariosDTO usuario = new UsuariosDTO();
        usuario.setUsuario("sebas");
        usuario.setPassword("HASH123");
        usuario.setNombreCompleto("Sebastian Diaz");
        usuario.setRol(Rol.ADMIN);

        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", List.of(usuario));
            return null;
        }).when(mapeo).SP_GETUSUARIO(anyMap());

        UsuariosDTO resultado = service.obtenerUsuario("sebas");

        assertEquals(usuario, resultado);

        verify(mapeo).SP_GETUSUARIO(argThat(params ->
                "sebas".equals(params.get("PA_USER"))
        ));
    }

    @Test
    void obtenerUsuarios_debeRetornarListaDeUsuarios() {

        UsuariosDTO usuario1 = new UsuariosDTO();
        usuario1.setUsuario("sebas");

        UsuariosDTO usuario2 = new UsuariosDTO();
        usuario2.setUsuario("juan");

        List<UsuariosDTO> lista = List.of(usuario1, usuario2);

        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", lista);
            return null;
        }).when(mapeo).SP_GETUSUARIOS(anyMap());

        List<UsuariosDTO> resultado = service.obtenerUsuarios();

        assertEquals(2, resultado.size());
        assertEquals(lista, resultado);

        verify(mapeo).SP_GETUSUARIOS(anyMap());
    }

    @Test
    void login_debeRetornarUsuarioSiPasswordEsCorrecto() {

        UsuariosDTO usuario = new UsuariosDTO();
        usuario.setUsuario("sebas");
        usuario.setPassword("HASH123");
        usuario.setRol(Rol.ADMIN);

        UsuariosService spyService = Mockito.spy(service);

        doReturn(usuario)
                .when(spyService)
                .obtenerUsuario("sebas");

        when(encoder.matches("123456", "HASH123"))
                .thenReturn(true);

        UsuariosDTO resultado = spyService.login("sebas", "123456");

        assertEquals(usuario, resultado);

        verify(encoder).matches("123456", "HASH123");
    }

    @Test
    void login_debeRetornarNullSiPasswordEsIncorrecto() {

        UsuariosDTO usuario = new UsuariosDTO();
        usuario.setUsuario("sebas");
        usuario.setPassword("HASH123");

        UsuariosService spyService = Mockito.spy(service);

        doReturn(usuario)
                .when(spyService)
                .obtenerUsuario("sebas");

        when(encoder.matches("incorrecta", "HASH123"))
                .thenReturn(false);

        UsuariosDTO resultado = spyService.login("sebas", "incorrecta");

        assertNull(resultado);

        verify(encoder).matches("incorrecta", "HASH123");
    }

    @Test
    void login_debeRetornarNullSiUsuarioNoExiste() {

        UsuariosService spyService = Mockito.spy(service);

        doReturn(null)
                .when(spyService)
                .obtenerUsuario("sebas");

        UsuariosDTO resultado = spyService.login("sebas", "123456");

        assertNull(resultado);

        verify(encoder, never()).matches(anyString(), anyString());
    }

    @Test
    void insertarUsuarios_debeEnviarParametrosCorrectos() {

        UsuariosDTO dto = new UsuariosDTO();
        dto.setUsuario("sebas");
        dto.setPassword("123456");
        dto.setNombreCompleto("Sebastian Diaz");
        dto.setRol(Rol.ADMIN);

        doReturn("HASH123")
                .when(encoder).encode("123456");

        service.insertarUsuarios(dto);

        verify(encoder).encode("123456");

        verify(mapeo).SP_SETUSUARIO(argThat(params ->
                "sebas".equals(params.get("PA_USER")) &&
                        "HASH123".equals(params.get("PA_PASSWORD")) &&
                        "Sebastian Diaz".equals(params.get("PA_NOMBRE")) &&
                        String.valueOf(Rol.ADMIN).equals(params.get("PA_ROL"))
        ));
    }

    @Test
    void actualizarUsuarios_debeEnviarParametrosCorrectos() {

        UsuariosDTO dto = new UsuariosDTO();
        dto.setIdUsuario(10);
        dto.setUsuario("sebas");
        dto.setPassword("123456");
        dto.setNombreCompleto("Sebastian Diaz");
        dto.setRol(Rol.ADMIN);

        UsuariosDTO usuarioActual = new UsuariosDTO();
        usuarioActual.setUsuario("sebas");
        usuarioActual.setPassword("HASH_EXISTENTE");

        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);

            params.put("rec_cursor", List.of(usuarioActual));

            return null;
        }).when(mapeo).SP_GETUSUARIO(anyMap());

        service.actualizarUsuarios(dto);

        verify(mapeo).SP_GETUSUARIO(argThat(params ->
                "sebas".equals(params.get("PA_USER"))
        ));

        verify(mapeo).SP_UPTUSUARIO(argThat(params ->
                Integer.valueOf(10).equals(params.get("PA_ID")) &&
                        "sebas".equals(params.get("PA_USER")) &&
                        "HASH_EXISTENTE".equals(params.get("PA_PASSWORD")) &&
                        "Sebastian Diaz".equals(params.get("PA_NOMBRE")) &&
                        String.valueOf(Rol.ADMIN).equals(params.get("PA_ROL"))
        ));
    }

    @Test
    void actualizarPassword_debeEnviarPasswordCifrado() {

        doReturn("HASH789")
                .when(encoder).encode("nueva123");

        service.actualizarPassword("sebas", "nueva123");

        verify(encoder).encode("nueva123");

        verify(mapeo).SP_UPDTPASSWORD(argThat(params ->
                "sebas".equals(params.get("PA_USER")) &&
                        "HASH789".equals(params.get("PA_PASSWORD"))
        ));
    }

    @Test
    void loadUserByUsername_debeConstruirUserDetails() {

        UsuariosDTO usuario = new UsuariosDTO();
        usuario.setUsuario("sebas");
        usuario.setPassword("HASH123");
        usuario.setRol(Rol.ADMIN);

        doAnswer(invocation -> {
            Map<String, Object> params = invocation.getArgument(0);
            params.put("rec_cursor", List.of(usuario));
            return null;
        }).when(mapeo).SP_GETUSUARIO(anyMap());

        UserDetails resultado = service.loadUserByUsername("sebas");

        assertEquals("sebas", resultado.getUsername());
        assertEquals("HASH123", resultado.getPassword());

        assertTrue(resultado.getAuthorities().stream()
                .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuthority())));

        verify(mapeo).SP_GETUSUARIO(argThat(params ->
                "sebas".equals(params.get("PA_USER"))
        ));
    }

    @Test
    void loadUserByUsername_debeLanzarExceptionSiUsuarioNoExiste() {

        UsuariosService spyService = Mockito.spy(service);

        doReturn(null)
                .when(spyService)
                .obtenerUsuario("sebas");

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> spyService.loadUserByUsername("sebas")
        );

        assertEquals("Usuario no encontrado", exception.getMessage());
    }

    @Test
    void borrarUsuario_debeEnviarUsuarioCorrecto() {

        service.borrarUsuario("sebas");

        verify(mapeo).SP_DELUSUARIO(argThat(params ->
                "sebas".equals(params.get("PA_USER"))
        ));
    }
}
