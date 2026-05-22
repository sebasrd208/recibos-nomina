package com.example.mybatis.dto;

import lombok.Data;

@Data
public class EnvioDTO {

    private String numEmpleado;
    private String correoEnviado;
    private long tiempoEjecucionMs;
}
