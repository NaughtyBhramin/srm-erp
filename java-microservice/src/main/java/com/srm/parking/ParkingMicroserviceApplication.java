package com.srm.parking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SRM University Parking Microservice
 * Handles real-time parking analytics, ANPR processing, and notifications
 */
@SpringBootApplication
@EnableScheduling
public class ParkingMicroserviceApplication {
    public static void main(String[] args) {
        System.out.println("==============================================");
        System.out.println("  SRM University Parking Microservice v1.0   ");
        System.out.println("==============================================");
        SpringApplication.run(ParkingMicroserviceApplication.class, args);
    }
}
