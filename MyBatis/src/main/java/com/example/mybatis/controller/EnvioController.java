package com.example.mybatis.controller;

import com.example.mybatis.dto.EnvioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletResponse;
import com.example.mybatis.service.EnvioService;
import com.example.mybatis.dto.ResultadoEnvioDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/envios-num")
@CrossOrigin
public class EnvioController {

    @Autowired
    EnvioService servicio;

    @PostMapping("/pendientes")
    public ResponseEntity<?> enviarCorreosPendientes(){
        try {
            ResultadoEnvioDTO resultado = servicio.procesoEnvioCorreos();
            return ResponseEntity.ok(resultado);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PatchMapping("/sueldo/pdf")
    public ResponseEntity<?> generarPdfSueldo(@RequestParam String numEmpleado, HttpServletResponse response) {
        try {
            byte[] pdfBytes = servicio.generatePdfSueldoNeto(numEmpleado);

            if (pdfBytes == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            response.setContentType("application/pdf");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"Recibo_" + numEmpleado + ".pdf\"");
            response.getOutputStream().write(pdfBytes);
            response.getOutputStream().flush();
            return ResponseEntity.ok().build();
        } catch (Exception s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/pendiente")
    public ResponseEntity<?> enviarCorreosPorEmpleado(@RequestParam String numEmpleado){

        try {
            EnvioDTO resultado = servicio.procesoEnvioCorreoPorEmpleado(numEmpleado);
            return ResponseEntity.ok(resultado);
        }catch(Exception s){
            String mensaje = s.getCause() != null
                    ? s.getCause().getMessage()
                    : s.getMessage();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensaje);
        }
    }
}
