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

    public List<UsuariosDTO> obtenerUsuario(String usuario) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_USER", usuario);
        mapeo.SP_GETUSUARIO(params);

        List<UsuariosDTO> usuarios = (List<UsuariosDTO>) params.get("rec_cursor");

        return usuarios;
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<UsuariosDTO> usuarios = obtenerUsuario(username);

        /*if(usuarios == null || usuarios.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }*/

        for(UsuariosDTO usuario: usuarios){
            return User.builder()
                    .username(usuario.getUsuario())
                    .password(usuario.getPassword())
                    .roles(String.valueOf(usuario.getRol()))
                    .build();
        }

        throw new UsernameNotFoundException("Usuario no encontrado");
    }
}
