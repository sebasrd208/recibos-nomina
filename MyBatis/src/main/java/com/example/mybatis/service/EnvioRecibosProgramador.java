package com.example.mybatis.service;

import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class EnvioRecibosProgramador {

    @Autowired
    TaskScheduler taskScheduler;

    @Autowired
    JobOperator jobOperator;

    @Autowired
    Job envioRecibosJob;

    public void programarEnvio(String numEmpleado, LocalDateTime fechaHora){

        Instant fechaEjecucion = fechaHora
                .atZone(ZoneId.of("America/Mexico_City"))
                .toInstant();

        if (!fechaEjecucion.isAfter(Instant.now())) {
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

            } catch (Exception e) {
                e.printStackTrace();
            }

        }, fechaEjecucion);
    }

}
