package com.example.mybatis.service;

import java.time.ZoneId;
import java.time.Instant;
import java.time.LocalDateTime;
import org.springframework.batch.core.job.Job;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;

@Service
public class EnvioRecibosProgramador {

    @Autowired
    TaskScheduler taskScheduler;

    @Autowired
    JobOperator jobOperator;

    @Autowired
    @Qualifier("envioRecibosJob")
    Job envioRecibosJob;

    @Autowired
    @Qualifier("envioMasivoJob")
    Job envioMasivoJob;

    public void programarEnvio(String numEmpleado, LocalDateTime fechaHora){

        Instant fechaEjecucion = fechaHora
                .atZone(ZoneId.of("America/Mexico_City"))
                .toInstant();

        if (fechaEjecucion.isBefore(Instant.now())) {
            throw new IllegalArgumentException(
                    "La fecha debe ser posterior a la fecha actual");
        }

        taskScheduler.schedule(() -> {
            try {
                JobParameters parametros = new JobParametersBuilder()
                        .addString("numEmpleado", numEmpleado)
                        .addLong("timestamp", System.currentTimeMillis())
                        .toJobParameters();

                jobOperator.start(envioRecibosJob, parametros);

            } catch (Exception s) {
                throw new RuntimeException(
                        "Ocurrió un error inesperado: "+s.getMessage());
            }
        }, fechaEjecucion);
    }

    public void programarEnvioMasivo(LocalDateTime fechaHora) {

        Instant fechaEjecucion = fechaHora
                .atZone(ZoneId.of("America/Mexico_City"))
                .toInstant();

        if (fechaEjecucion.isBefore(Instant.now())) {
            throw new IllegalArgumentException(
                    "La fecha debe ser después de la actual");
        }

        taskScheduler.schedule(() -> {
            try {
                JobParameters parametros = new JobParametersBuilder()
                        .addLong("timestamp", System.currentTimeMillis())
                        .toJobParameters();

                jobOperator.start(envioMasivoJob, parametros);

            } catch (Exception s) {
                throw new RuntimeException(
                        "Ocurrió un error inesperado: "+s.getMessage());
            }
        }, fechaEjecucion);
    }

}
