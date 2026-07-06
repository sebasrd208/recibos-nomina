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

    @PutMapping("/editar")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    public ResponseEntity<?> editar(@RequestBody UsuariosDTO dto) {
        try {
            service.actualizarUsuarios(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Actualización exitosa\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/username")
    @Operation(summary = "Mostrar usuario", description = "Muestra los datos del usuario")
    public ResponseEntity<?> mostrarUsuario(@RequestParam String usuario) {
        try {
            UsuariosDTO username = service.obtenerUsuario(usuario);
            return ResponseEntity.ok(username);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping
    @Operation(summary = "Mostrar usuario", description = "Muestra los datos del usuario")
    public ResponseEntity<?> mostrarUsuarios() {
        try {
            List<UsuariosDTO> usuarios = service.obtenerUsuarios();
            return ResponseEntity.ok(usuarios);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticación de usuarios", description = "Autentica los usuario y verifica los roles de tal usuario")
    public ResponseEntity<?> login(@RequestBody LoginDTO credencial) {
        try {
            UsuariosDTO username = service.login(credencial.getUsuario(), credencial.getPassword());

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario o contraseña incorrectos");
            }
            return ResponseEntity.ok(username);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @DeleteMapping("/eliminar")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario existente")
    public ResponseEntity<?> eliminar(@RequestParam String username) {
        try {
            service.borrarUsuario(username);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Usuario eliminado de manera exitosa\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
