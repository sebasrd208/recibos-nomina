package com.example.mybatis.dto;

import com.example.mybatis.cifrado.CryptoUtils;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import javax.crypto.SecretKey;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PercepcionDTO {

    private String sueldo;
    private String sueldoBruto;

    public void encryptFields(SecretKey key) {
        try {
            if (sueldo != null) sueldo = CryptoUtils.encrypt(sueldo, key);
            if (sueldoBruto != null) sueldoBruto = CryptoUtils.encrypt(sueldoBruto, key);
        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar PercepcionDTO", e);
        }
    }
}
