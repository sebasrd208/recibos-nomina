package com.example.mybatis.config;

import org.springframework.http.*;
import org.springframework.security.web.*;
import org.springframework.security.config.*;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.method.configuration.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> {
            csrf.disable();
        });
        http.cors(cors -> {});
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/usuarios/**").permitAll();
            auth.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/v2/api-docs",
                    "/swagger-resources/**", "/webjars/**").permitAll();
            auth.requestMatchers(HttpMethod.GET, "/companias/**", "/documentos/**", "/empleados/**", "/universal/**")
                    .hasAnyRole("USER", "ADMIN");
            auth.requestMatchers("/companias/**", "/documentos/**", "/empleados/**", "/envios-num/**", "/universal/**").hasRole("ADMIN");
            auth.anyRequest().authenticated();
        });

        http.httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}