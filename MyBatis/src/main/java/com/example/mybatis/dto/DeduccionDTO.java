package com.example.mybatis.dto;

import com.example.mybatis.config.cifrado.*;
import javax.crypto.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeduccionDTO {

    private String isr;
    private String imss;
    private String fondoAhorro;
    private String totalDeducciones;

    public void encryptFields(SecretKey key) {
        try {
            if (isr != null) isr = CryptoUtils.encrypt(isr, key);
            if (imss != null) imss = CryptoUtils.encrypt(imss, key);
            if (fondoAhorro != null) fondoAhorro = CryptoUtils.encrypt(fondoAhorro, key);
            if (totalDeducciones != null) totalDeducciones = CryptoUtils.encrypt(totalDeducciones, key);
        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar DeduccionDTO", e);
        }
    }

}
