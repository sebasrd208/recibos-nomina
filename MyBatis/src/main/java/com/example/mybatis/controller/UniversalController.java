package com.example.mybatis.controller;

import com.example.mybatis.dto.*;
import org.springframework.http.*;
import com.example.mybatis.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

@RestController
@RequestMapping("/universal")
@CrossOrigin
public class UniversalController {

    @Autowired
    UniversalService service;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody UniversalDTO dto) {
        try {
            service.insertar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @DeleteMapping("/borrar")
    public ResponseEntity<?> borradoUniversal(@RequestParam String numEmpleado) {
        try {
            service.borradoUniversal(numEmpleado);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Borrado exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
