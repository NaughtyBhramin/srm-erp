package com.srm.parking.controller;

import com.srm.parking.service.ParkingAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Parking Analytics REST Controller
 * Exposes analytics endpoints consumed by the FastAPI backend
 */
@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParkingController {
    
    private final ParkingAnalyticsService analyticsService;
    
    @GetMapping("/analytics/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        return ResponseEntity.ok(analyticsService.getAnalyticsSummary());
    }
    
    @GetMapping("/analytics/peak-hours")
    public ResponseEntity<Map<String, Object>> getPeakHours() {
        return ResponseEntity.ok(analyticsService.getPeakHoursAnalysis());
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "SRM Parking Microservice",
            "version", "1.0.0"
        ));
    }
}
