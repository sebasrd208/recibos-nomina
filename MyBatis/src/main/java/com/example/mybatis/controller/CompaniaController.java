package com.example.mybatis.controller;

import java.util.*;
import com.example.mybatis.dto.*;
import org.springframework.http.*;
import com.example.mybatis.service.*;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

@RestController
@RequestMapping("/companias")
@CrossOrigin
@Tag(name = "EMPRESAS", description = "API PARA EMPRESAS")
public class CompaniaController {
        
    @Autowired
    CompaniaService servicio;
    
    @GetMapping("/mostrar")
    @Operation(summary = "Mostrar Empresas", description = "Muestra todos los empresas registradas")
    public ResponseEntity<?> mostrarCompanias() {
        try {
            List<CompaniaDTO> lista = servicio.obtenerCompanias();
            return ResponseEntity.ok(lista);
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @PostMapping("/guardar")
    @Operation(summary = "Registrar empresa", description = "Registra una nueva empresa")
    public ResponseEntity<?> guardar(@RequestBody CompaniaDTO dto) {
        try {            
            servicio.insertarCompania(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @GetMapping("/buscar")
    @Operation(summary = "Mostrar datos de la empresa", description = "Se obtienen datos de la empresa donde trabaja esta persona")
    public ResponseEntity<?> mostrarEmpresa(@RequestParam String numEmpleado){
        try {
            CompaniaDTO usuario = servicio.obtenerEmpleados(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
