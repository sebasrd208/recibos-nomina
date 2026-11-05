package com.example.mybatis.controller;

import org.springframework.http.HttpStatus;
import com.example.mybatis.dto.UniversalDTO;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.service.UniversalService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

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
