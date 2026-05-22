package com.example.mybatis.dto;

import com.example.mybatis.config.cifrado.CryptoUtils;
import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.crypto.SecretKey;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeduccionesDTO {
    
    @JsonIgnore
    private String nombre;
    private String bruto;
    private String ISR;
    private String IMSS;
    private String fondo;
    private String neto;

    // Encriptar los campos sensibles
    public void encryptFields(SecretKey key) {
        try {
            if (nombre != null) nombre = CryptoUtils.encrypt(nombre, key);
            if (bruto != null) bruto = CryptoUtils.encrypt(bruto, key);
            if (ISR != null) ISR = CryptoUtils.encrypt(ISR, key);
            if (IMSS != null) IMSS = CryptoUtils.encrypt(IMSS, key);
            if (fondo != null) fondo = CryptoUtils.encrypt(fondo, key);
            if (neto != null) neto = CryptoUtils.encrypt(neto, key);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
