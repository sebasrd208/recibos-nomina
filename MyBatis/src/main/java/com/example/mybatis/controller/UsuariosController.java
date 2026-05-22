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
@RequestMapping("/usuarios")
@CrossOrigin
@Tag(name = "API DE USUARIOS", description = "API para el registro de usuarios")
public class UsuariosController {

    @Autowired
    UsuariosService service;

    @PostMapping("/guardar")
    @Operation(summary = "Registrar usuario", description = "Registra un nueva usuario")
    public ResponseEntity<?> guardar(@RequestBody UsuariosDTO dto) {
        try {
            service.insertarUsuarios(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/username")
    @Operation(summary = "Mostrar usuario", description = "Muestra los datos del usuario")
    public ResponseEntity<?> mostrarNetoEmpleado(@RequestParam String usuario) {
        try {
            List<UsuariosDTO> username = service.obtenerUsuario(usuario);
            return ResponseEntity.ok(username);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
