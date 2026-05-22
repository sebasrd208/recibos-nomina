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
@RequestMapping("/documentos")
@CrossOrigin
@Tag(name = "DOCUMENTOS", description = "API PARA DOCUMENTOS")
public class DocumentoController {
    
    @Autowired
    DocumentoService servicio;
    
    @GetMapping("/mostrar")
    @Operation(summary = "Mostrar documentos", description = "Muestra todos los documentos registradas")
    public ResponseEntity<?> mostrarDocumentos() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerDocumentos();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @GetMapping("/status")
    @Operation(summary = "Mostrar status", description = "Busca los status 0 de documentos")
    public ResponseEntity<?> mostrarStatus() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatus();
            return ResponseEntity.ok(lista);
        } catch (Exception s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/status-uno")
    @Operation(summary = "Mostrar status 1", description = "Busca los status 1 de documentos")
    public ResponseEntity<?> mostrarStatusUno() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatusUno();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/status-dos")
    @Operation(summary = "Mostrar status 2", description = "Busca los status 2 de documentos")
    public ResponseEntity<?> mostrarStatusDos() {
        try {
            List<DocumentoDTO> lista = servicio.obtenerStatusDos();
            return ResponseEntity.ok(lista);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/guardar")
    @Operation(summary = "Registrar documento", description = "Registra una nueva documento")
    public ResponseEntity<?> guardar(@RequestBody DocumentoDTO dto) {
        try {            
            servicio.insertarDocumenctos(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar documento", description = "Muestra los datos de un documento especifico")
    public ResponseEntity<?> buscar(@RequestParam String numEmpleado) {
        try {
            DocumentoDTO usuario = servicio.byNumEmpleado(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}