package com.example.mybatis.dto;

import lombok.*;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SueldoNetoDTO {

    private String numEmpleado;
    private List<CompaniaDTO> datos;
    private List<DeduccionesDTO> deducciones;
    private List<ImpuestosDTO> impuestos;
}
