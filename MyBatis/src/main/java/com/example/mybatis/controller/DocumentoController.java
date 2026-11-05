package com.example.mybatis.controller;

import java.util.*;
import com.example.mybatis.dto.*;
import org.springframework.http.*;
import com.example.mybatis.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;

@RestController
@RequestMapping("/documentos")
@CrossOrigin
public class DocumentoController {
    
    @Autowired
    DocumentoService servicio;
    
    @GetMapping("/mostrar")
    public ResponseEntity<?> mostrarDocumentos() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerDocumentos();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> mostrarStatus() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatus();
            return ResponseEntity.ok(lista);
        } catch (Exception s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/status-uno")
    public ResponseEntity<?> mostrarStatusUno() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatusUno();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/status-dos")
    public ResponseEntity<?> mostrarStatusDos() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatusDos();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody DocumentoDTO dto) {
        try {            
            servicio.insertarDocumenctos(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam String numEmpleado) {
        try {
            DocumentoDTO usuario = servicio.byNumEmpleado(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}