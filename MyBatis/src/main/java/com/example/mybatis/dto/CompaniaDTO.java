package com.example.mybatis.dto;

import com.example.mybatis.config.cifrado.CryptoUtils;
import com.fasterxml.jackson.annotation.*;
import javax.crypto.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompaniaDTO {
    
    @JsonIgnore
    private Integer idCompania;
    private String nombre;
    private String apellido;
    private String numEmpleado;
    private String rfc;
    private String compania;
    private String nota;
    private String trimestre;

    public void encryptFields(SecretKey key) {
        try {
            if (apellido != null) apellido = CryptoUtils.encrypt(apellido, key);
            if (numEmpleado != null) numEmpleado = CryptoUtils.encrypt(numEmpleado, key);
            if (rfc != null) rfc = CryptoUtils.encrypt(rfc, key);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
