package com.example.mybatis.controller;

import jakarta.servlet.http.*;
import com.example.mybatis.dto.*;
import org.springframework.http.*;
import com.example.mybatis.service.*;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/envios-num")
@CrossOrigin
@Tag(name = "API DE ENVIOS", description = "API PARA ENVIOS")
public class EnvioController {

    @Autowired
    EnvioService servicio;

    @PostMapping("/pendientes")
    @Operation(summary = "Envios pendientes", description = "Envia correos con estatus 0")
    public ResponseEntity<?> enviarCorreosPendientes(){
        ResultadoEnvioDTO resultado = servicio.procesoEnvioCorreos();
        return ResponseEntity.ok(resultado);
    }

    @PatchMapping("/neto/pdf")
    @Operation(summary = "Mostrar sueldo neto", description = "Muestra un sueldo neto de un empleado especifico")
    public ResponseEntity<?> generarPdf(@RequestParam String numEmpleado, HttpServletResponse response) {
        try {
            byte[] pdfBytes = servicio.generatePdfSueldo(numEmpleado);

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
    @Operation(summary = "Envios pendientes", description = "Envia correos con estatus 0")
    public ResponseEntity<?> enviarCorreosPorEmpleado(@RequestParam String numEmpleado){

        try {
            EnvioDTO resultado = servicio.procesoEnvioCorreoPorEmpleado(numEmpleado);
            return ResponseEntity.ok(resultado);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage());
            //return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
