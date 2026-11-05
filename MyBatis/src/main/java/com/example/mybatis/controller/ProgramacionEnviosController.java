package com.example.mybatis.controller;

import java.util.Locale;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.dto.ProgramarEnvioDTO;
import com.example.mybatis.service.EnvioRecibosProgramador;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class ProgramacionEnviosController {

    @Autowired
    EnvioRecibosProgramador recibosProgramador;

    @PostMapping("/programar-envio")
    public ResponseEntity<?> programarEnvio(@RequestBody ProgramarEnvioDTO dto) {

        try {
            recibosProgramador.programarEnvio(dto.getNumEmpleado(), dto.getFechaHora());

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm:ss a", Locale.US);

            String fechaFormateada = dto.getFechaHora().format(formatter);

            return ResponseEntity.ok("Envío programado correctamente para " + fechaFormateada);

        } catch (Exception s) {
            String mensaje = s.getCause() != null
                    ? s.getCause().getMessage()
                    : s.getMessage();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(mensaje);
        }
    }

    @PostMapping("/programar-masivo")
    public ResponseEntity<String> programarEnvioMasivo(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHora) {

        try {
            recibosProgramador.programarEnvioMasivo(fechaHora);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm:ss a", Locale.US);

            String fechaFormateada = fechaHora.format(formatter);

            return ResponseEntity.ok("Envío masivo programado correctamente para " + fechaFormateada);
        }catch(Exception s){

            String mensaje = s.getCause() != null
                    ? s.getCause().getMessage()
                    : s.getMessage();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(mensaje);
        }
    }
}
