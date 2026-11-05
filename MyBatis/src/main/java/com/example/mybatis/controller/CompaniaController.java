package com.example.mybatis.controller;

import java.util.List;
import com.example.mybatis.dto.CompaniaDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.service.CompaniaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/companias")
@CrossOrigin
public class CompaniaController {
        
    @Autowired
    CompaniaService servicio;
    
    @GetMapping("/mostrar")
    public ResponseEntity<?> mostrarCompanias() {
        try {
            List<CompaniaDTO> lista = servicio.obtenerCompanias();
            return ResponseEntity.ok(lista);
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody CompaniaDTO dto) {
        try {            
            servicio.insertarCompania(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<?> mostrarEmpresa(@RequestParam String numEmpleado){
        try {
            CompaniaDTO usuario = servicio.obtenerEmpleados(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }
}
