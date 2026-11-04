package com.example.mybatis.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProgramarEnvioDTO {

    private String numEmpleado;
    private LocalDateTime fechaHora;

}
