package com.example.mybatis.dto;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

@Data
public class UsuariosDTO {

    private Integer idUsuario;
    private String usuario;
    private String password;
    private Rol rol;

}
