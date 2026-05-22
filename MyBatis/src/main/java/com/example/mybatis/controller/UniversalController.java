package com.example.mybatis.controller;

import com.example.mybatis.dto.*;
import org.springframework.http.*;
import com.example.mybatis.service.*;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

@RestController
@RequestMapping("/universal")
@CrossOrigin
@Tag(name = "EMPRESAS", description = "API PARA EMPRESAS")
public class UniversalController {

    @Autowired
    UniversalService service;

    @PostMapping("/guardar")
    @Operation(summary = "Registrar empresa", description = "Registra una nueva empresa")
    public ResponseEntity<?> guardar(@RequestBody UniversalDTO dto) {
        try {
            service.insertar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @DeleteMapping("/borrar")
    @Operation(summary = "Registrar empresa", description = "Registra una nueva empresa")
    public ResponseEntity<?> borradoUniversal(@RequestParam String numEmpleado) {
        try {
            service.borradoUniversal(numEmpleado);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Borrado exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
