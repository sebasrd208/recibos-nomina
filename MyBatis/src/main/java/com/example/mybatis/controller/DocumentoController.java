package com.example.mybatis.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import com.example.mybatis.dto.DocumentoDTO;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.service.DocumentoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

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