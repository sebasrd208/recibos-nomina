package com.example.mybatis.exception;

import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationHandler(MethodArgumentNotValidException s){
        Map<String, String> errores=new HashMap<>();

        s.getBindingResult().getFieldErrors().forEach(error->
                errores.put(error.getField(), error.getDefaultMessage()));


        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    @ExceptionHandler(RegistroException.class)
    public ResponseEntity<?> handlerRegistro(RegistroException s){
        String mensaje = s.getMessage().lines().findFirst().orElse("").trim();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", mensaje));
    }

    @ExceptionHandler(ConsultaException.class)
    public ResponseEntity<?> handlerConsulta(ConsultaException s){
        String mensaje = s.getCause().getMessage().lines().findFirst().orElse("").trim();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", mensaje));
    }
}
