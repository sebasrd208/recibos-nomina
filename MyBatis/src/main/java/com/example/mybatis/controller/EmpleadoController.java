package com.example.mybatis.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import com.example.mybatis.dto.EmpleadoDTO;
import com.example.mybatis.dto.SueldoNetoDTO;
import org.springframework.http.ResponseEntity;
import com.example.mybatis.service.EnvioService;
import com.example.mybatis.service.EmpleadoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/empleados")
@CrossOrigin
public class EmpleadoController {

    @Autowired
    EmpleadoService servicio;

    @Autowired
    EnvioService servicioE;

    @GetMapping("/mostrar")
    public ResponseEntity<?> mostrar() {
        try {
            List<EmpleadoDTO> lista = servicio.obtenerEmpleados();
            return ResponseEntity.ok(lista);
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/sueldo")
    public ResponseEntity<?> mostrarSueldo(@RequestParam String numEmpleado) {
        try {
            SueldoNetoDTO usuario = servicio.obtenerSueldo(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam String numEmpleado) {
        try {
            EmpleadoDTO usuario = servicio.byNumEmpleado(numEmpleado);
            return ResponseEntity.ok(usuario);
        }catch(Exception s){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getCause().getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody EmpleadoDTO dto) {
        try {
            servicio.insertarEmpleados(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Registro exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizar(@RequestBody EmpleadoDTO dto) {
        try {
            servicio.actualizarEmpleados(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"Mensaje\":\"Actualización exitoso\"}");
        } catch (RuntimeException s) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(s.getMessage().lines().findFirst().orElse("").trim());
        }
    }

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarCorreo(@RequestParam String correo, @RequestParam String nombre) {
        try {
            servicioE.envioCorreoAdjunto(correo, nombre);
            return ResponseEntity.ok("Correo enviado correctamente a " + correo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el correo: " + e.getMessage());
        }
    }
}
