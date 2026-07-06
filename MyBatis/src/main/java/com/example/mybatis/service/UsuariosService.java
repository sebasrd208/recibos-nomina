package com.example.mybatis.service;

import java.util.*;
import com.example.mybatis.dto.*;
import org.springframework.dao.*;
import com.example.mybatis.mappers.*;
import org.springframework.stereotype.*;
import org.springframework.security.crypto.password.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.security.core.userdetails.*;

@Service
public class UsuariosService implements UserDetailsService {

    @Autowired
    MapeoGeneral mapeo;

    @Autowired
    PasswordEncoder encoder;

    public UsuariosDTO obtenerUsuario(String usuario) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_USER", usuario);
        mapeo.SP_GETUSUARIO(params);

        List<UsuariosDTO> usuarios = (List<UsuariosDTO>) params.get("rec_cursor");

        return usuarios.get(0);
    }

    public List<UsuariosDTO> obtenerUsuarios() {
        Map<String, Object> params = new HashMap<>();
        mapeo.SP_GETUSUARIOS(params);

        List<UsuariosDTO> usuarios = (List<UsuariosDTO>) params.get("rec_cursor");

        return usuarios;
    }

    public UsuariosDTO login(String usuario, String password) {

        UsuariosDTO user = obtenerUsuario(usuario);

        if (user == null) {
            return null;
        }

        if (!encoder.matches(password, user.getPassword())) {
            return null;
        }

        return user;
    }

    public void insertarUsuarios(UsuariosDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_USER", dto.getUsuario());
        params.put("PA_PASSWORD", encoder.encode(dto.getPassword()));
        params.put("PA_ROL", String.valueOf(dto.getRol()));

        try {
            mapeo.SP_SETUSUARIO(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }

    public void actualizarUsuarios(UsuariosDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_ID", dto.getIdUsuario());
        params.put("PA_USER", dto.getUsuario());
        params.put("PA_PASSWORD", encoder.encode(dto.getPassword()));
        params.put("PA_ROL", String.valueOf(dto.getRol()));

        try {
            mapeo.SP_UPTUSUARIO(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsuariosDTO usuario = obtenerUsuario(username);

        if(usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        return User.builder()
                .username(usuario.getUsuario())
                .password(usuario.getPassword())
                .roles(String.valueOf(usuario.getRol()))
                .build();

    }

    public void borrarUsuario(String username){
        Map<String, Object> params = new HashMap<>();
        params.put("PA_USER", username);

        try {
            mapeo.SP_DELUSUARIO(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }
}
