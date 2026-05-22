package com.example.mybatis.config.cifrado;

import org.springframework.context.annotation.*;
import javax.crypto.*;

@Configuration
public class CryptoConfig {

    @Bean
    public SecretKey secretKey() throws Exception {

        String keyStr = "k1mQ8v+X7E4A9sFhYg6zqw==";
        return CryptoUtils.stringToKey(keyStr);
    }
}