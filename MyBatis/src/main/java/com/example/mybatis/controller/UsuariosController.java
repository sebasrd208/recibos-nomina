package com.example.mybatis.controller;

import java.util.List;
import com.example.mybatis.dto.UsuariosDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.service.UsuariosService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuariosController {

    @Autowired
    UsuariosService service;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody UsuariosDTO dto) {
        try {
            service.insertarUsuarios(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PutMapping("/editar")
    public ResponseEntity<?> editar(@RequestBody UsuariosDTO dto) {
        try {
            service.actualizarUsuarios(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Actualización exitosa\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PutMapping("/actualizar-password")
    public ResponseEntity<?> actualizarPassword(@RequestParam String username, @RequestParam String password){
        try {
            service.actualizarPassword(username, password);
            return ResponseEntity.status(HttpStatus.OK).body("{\"Mensaje\":\"Se actualizó la contraseña del usuario "+username+"\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/username")
    public ResponseEntity<?> mostrarUsuario(@RequestParam String usuario) {
        try {
            UsuariosDTO username = service.obtenerUsuario(usuario);
            return ResponseEntity.ok(username);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping
    public ResponseEntity<?> mostrarUsuarios() {
        try {
            List<UsuariosDTO> usuarios = service.obtenerUsuarios();
            return ResponseEntity.ok(usuarios);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String usuario, @RequestParam String password) {
        try {
            UsuariosDTO username = service.login(usuario, password);

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
    public ResponseEntity<?> eliminar(@RequestParam String username) {
        try {
            service.borrarUsuario(username);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Usuario eliminado de manera exitosa\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
