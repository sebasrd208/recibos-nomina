package com.example.mybatis.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnvioRecibosProgramadorTest {

    @Mock
    TaskScheduler taskScheduler;

    @Mock
    JobOperator jobOperator;

    @Mock
    @Qualifier("envioRecibosJob")
    Job envioRecibosJob;

    @Mock
    @Qualifier("envioMasivoJob")
    Job envioMasivoJob;

    @InjectMocks
    EnvioRecibosProgramador service;

    @Test
    void programarEnvio_debeProgramarEjecucionCorrectamente() throws Exception {

        String numEmpleado = "12345";
        LocalDateTime fechaHora = LocalDateTime.now(
                ZoneId.of("America/Mexico_City")
        ).plusMinutes(5);

        service.programarEnvio(numEmpleado, fechaHora);

        ArgumentCaptor<Runnable> runnableCaptor =
                ArgumentCaptor.forClass(Runnable.class);
        ArgumentCaptor<Instant> instantCaptor =
                ArgumentCaptor.forClass(Instant.class);

        verify(taskScheduler).schedule(
                runnableCaptor.capture(),
                instantCaptor.capture()
        );

        Instant fechaEsperada = fechaHora
                .atZone(ZoneId.of("America/Mexico_City"))
                .toInstant();

        assertEquals(fechaEsperada, instantCaptor.getValue());

        runnableCaptor.getValue().run();

        ArgumentCaptor<JobParameters> parametrosCaptor =
                ArgumentCaptor.forClass(JobParameters.class);

        verify(jobOperator).start(
                eq(envioRecibosJob),
                parametrosCaptor.capture()
        );

        JobParameters parametros = parametrosCaptor.getValue();

        assertEquals(numEmpleado, parametros.getString("numEmpleado"));
        assertNotNull(parametros.getLong("timestamp"));
    }

    @Test
    void programarEnvio_debeRechazarFechaPasada() {

        LocalDateTime fechaPasada = LocalDateTime.now(
                ZoneId.of("America/Mexico_City")
        ).minusMinutes(5);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.programarEnvio("12345", fechaPasada)
        );

        verifyNoInteractions(taskScheduler);
        verifyNoInteractions(jobOperator);
    }

    @Test
    void programarEnvioMasivo_debeProgramarEjecucionCorrectamente() throws Exception{

        LocalDateTime fechaHora = LocalDateTime.now(
                ZoneId.of("America/Mexico_City")
        ).plusMinutes(5);

        service.programarEnvioMasivo(fechaHora);

        ArgumentCaptor<Runnable> runnableCaptor =
                ArgumentCaptor.forClass(Runnable.class);
        ArgumentCaptor<Instant> instantCaptor =
                ArgumentCaptor.forClass(Instant.class);

        verify(taskScheduler).schedule(
                runnableCaptor.capture(),
                instantCaptor.capture()
        );

        Instant fechaEsperada = fechaHora
                .atZone(ZoneId.of("America/Mexico_City"))
                .toInstant();

        assertEquals(fechaEsperada, instantCaptor.getValue());

        runnableCaptor.getValue().run();

        ArgumentCaptor<JobParameters> parametrosCaptor =
                ArgumentCaptor.forClass(JobParameters.class);

        verify(jobOperator).start(
                eq(envioMasivoJob),
                parametrosCaptor.capture()
        );

        JobParameters parametros = parametrosCaptor.getValue();

        assertNotNull(parametros.getLong("timestamp"));
        assertNull(parametros.getString("numEmpleado"));
    }

    @Test
    void programarEnvioMasivo_debeRechazarFechaPasada() {

        LocalDateTime fechaPasada = LocalDateTime.now(
                ZoneId.of("America/Mexico_City")
        ).minusMinutes(5);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.programarEnvioMasivo(fechaPasada)
        );

        verifyNoInteractions(taskScheduler);
        verifyNoInteractions(jobOperator);
    }
}
