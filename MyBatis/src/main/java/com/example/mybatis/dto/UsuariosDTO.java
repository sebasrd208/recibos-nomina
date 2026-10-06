package com.example.mybatis.dto;

import lombok.*;

@Data
public class UsuariosDTO {

    private Integer idUsuario;
    private String usuario;
    private String password;
    private String nombreCompleto;
    private Rol rol;

}
