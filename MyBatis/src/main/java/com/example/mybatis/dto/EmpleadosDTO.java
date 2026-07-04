package com.example.mybatis.dto;

import com.example.mybatis.config.cifrado.*;
import javax.crypto.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpleadosDTO {

    private String nombre;
    private String apellido;
    private String rfc;
    private String compania;
    private String nota;
    private String trimestre;

    public void encryptFields(SecretKey key) {
        try {
            if (nombre != null) nombre = CryptoUtils.encrypt(nombre, key);
            if (apellido != null) apellido = CryptoUtils.encrypt(apellido, key);
            if (rfc != null) rfc = CryptoUtils.encrypt(rfc, key);
            if (compania != null) compania = CryptoUtils.encrypt(compania, key);
            if (nota != null) nota = CryptoUtils.encrypt(nota, key);
            if (trimestre != null) trimestre = CryptoUtils.encrypt(trimestre, key);
        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar EmpleadosDTO", e);
        }
    }
}
