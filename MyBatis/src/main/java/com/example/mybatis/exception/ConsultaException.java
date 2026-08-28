package com.example.mybatis.exception;

public class ConsultaException extends RuntimeException {
    public ConsultaException(String message, Throwable causa) {
        super(message, causa);
    }
}
