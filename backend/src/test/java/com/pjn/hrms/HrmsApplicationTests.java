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
        try (ConfigurableApplicationContext context = SpringApplication.run(HrmsApplication.class, "--spring.main.web-application-type=none")) {
            assertNotNull(context, "Spring application context should not be null");
            assertTrue(context.isRunning(), "Spring application context should be running");
        }
    }
}

