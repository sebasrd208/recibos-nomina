package com.example.mybatis.dto;

import lombok.*;

@Data
public class DocumentoDTO {
    
    private Integer idDocumento;    
    private String nombre;
    private String apellido;
    private String documento;
    private String numEmpleado;
    private String correo;
    private String status;

}
