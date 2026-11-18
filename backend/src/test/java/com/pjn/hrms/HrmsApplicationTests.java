package com.pjn.hrms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HrmsApplicationTests {

    @Test
    void contextLoads() {
        // Explicitly start and cleanly close context to avoid open daemon threads on Windows
        // In local unit verification where PostgreSQL daemon is offline, disable datasources for bootstrap check
        try (ConfigurableApplicationContext context = SpringApplication.run(
                HrmsApplication.class,
                "--spring.main.web-application-type=none",
                "--spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration"
        )) {
            assertNotNull(context, "Spring application context should not be null");
            assertTrue(context.isRunning(), "Spring application context should be running");
        }
    }
}

