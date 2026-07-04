package com.example.mybatis.dto;

import com.example.mybatis.config.cifrado.*;
import javax.crypto.*;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SueldoNetoDTO {

    private EmpleadosDTO empleado;
    private PercepcionDTO percepcion;
    private DeduccionDTO deduccion;
    private String sueldoNeto;

    public void encryptFields(SecretKey key) {
        try {
            if (empleado != null) {
                empleado.encryptFields(key);
            }

            if (percepcion != null) {
                percepcion.encryptFields(key);
            }

            if (deduccion != null) {
                deduccion.encryptFields(key);
            }

            if (sueldoNeto != null) {
                sueldoNeto = CryptoUtils.encrypt(sueldoNeto, key);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar SueldoDTO", e);
        }
    }
}
