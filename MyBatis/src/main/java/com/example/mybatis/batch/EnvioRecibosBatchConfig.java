package com.example.mybatis.batch;

import com.example.mybatis.service.EnvioService;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class EnvioRecibosBatchConfig {

    @Bean
    public Job envioRecibosJob(JobRepository jobRepository, Step envioRecibosStep){

        return new JobBuilder("envioRecibosJob", jobRepository)
                .start(envioRecibosStep)
                .build();
    }

    @Bean
    public Step envioRecibosStep(JobRepository jobRepository, PlatformTransactionManager transactionManager, EnvioService envioService) {

        return new StepBuilder("envioRecibosStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {

                    String numEmpleado = contribution
                            .getStepExecution()
                            .getJobParameters()
                            .getString("numEmpleado");

                    envioService.procesoEnvioCorreoPorEmpleado(numEmpleado);

                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

}
