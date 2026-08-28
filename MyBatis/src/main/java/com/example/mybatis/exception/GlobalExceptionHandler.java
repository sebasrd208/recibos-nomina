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

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handlerRuntime(RuntimeException s){

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("", s.getMessage().lines().findFirst().orElse("").trim()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handlerRuntimeTwo(RuntimeException s){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("", s.getCause().getMessage().lines().findFirst().orElse("").trim()));
    }
}
