package com.example.mybatis.batch;

import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

//@Component
public class EnvioRecibosScheduler {

    /*@Autowired
    JobOperator jobOperator;

    @Autowired
    Job envioRecibosJob;

    @Scheduled(fixedRate = 60000)
    public void ejecutarEnvioRecibos() throws Exception {

        JobParameters parametros = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        jobOperator.start(envioRecibosJob, parametros);
    }*/
}
