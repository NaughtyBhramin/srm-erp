package com.srm.parking.service;

import com.srm.parking.model.ParkingSession;
import com.srm.parking.model.ParkingZone;
import com.srm.parking.repository.ParkingSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Parking Analytics Service
 * Provides real-time analytics, occupancy tracking, and scheduled reports
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ParkingAnalyticsService {
    
    private final ParkingSessionRepository sessionRepository;
    
    // In-memory analytics cache (in production, use Redis)
    private final Map<String, Object> analyticsCache = new HashMap<>();
    
    /**
     * Refresh analytics every 30 seconds
     */
    @Scheduled(fixedRate = 30000)
    public void refreshAnalytics() {
        log.debug("Refreshing parking analytics...");
        try {
            long activeSessions = sessionRepository.countActiveSessions();
            long todaySessions = sessionRepository.countTodaySessions(
                LocalDate.now().atStartOfDay()
            );
            
            analyticsCache.put("activeSessions", activeSessions);
            analyticsCache.put("todaySessions", todaySessions);
            analyticsCache.put("lastUpdated", LocalDateTime.now().toString());
            
            log.info("Analytics refreshed - Active: {}, Today: {}", activeSessions, todaySessions);
        } catch (Exception e) {
            log.error("Error refreshing analytics: {}", e.getMessage());
        }
    }
    
    /**
     * Get current analytics summary
     */
    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>(analyticsCache);
        
        // Add real-time count if not cached
        if (!summary.containsKey("activeSessions")) {
            summary.put("activeSessions", sessionRepository.countActiveSessions());
        }
        
        return summary;
    }
    
    /**
     * Get peak hours analysis
     */
    public Map<String, Object> getPeakHoursAnalysis() {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<ParkingSession> sessions = sessionRepository.findRecentSessions(since);
        
        // Count by hour
        int[] hourlyCount = new int[24];
        for (ParkingSession session : sessions) {
            int hour = session.getEntryTime().getHour();
            hourlyCount[hour]++;
        }
        
        // Find peak hour
        int peakHour = 0;
        int peakCount = 0;
        for (int i = 0; i < 24; i++) {
            if (hourlyCount[i] > peakCount) {
                peakCount = hourlyCount[i];
                peakHour = i;
            }
        }
        
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("hour", String.format("%02d:00", i));
            entry.put("count", hourlyCount[i]);
            hourlyData.add(entry);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("hourlyData", hourlyData);
        result.put("peakHour", String.format("%02d:00", peakHour));
        result.put("peakCount", peakCount);
        result.put("periodDays", 7);
        
        return result;
    }
    
    /**
     * Check for long-parked vehicles (> 8 hours) and flag them
     */
    @Scheduled(fixedRate = 3600000) // Every hour
    public void checkLongParkedVehicles() {
        LocalDateTime eightHoursAgo = LocalDateTime.now().minusHours(8);
        List<ParkingSession> activeSessions = sessionRepository.findByStatus("active");
        
        long longParked = activeSessions.stream()
            .filter(s -> s.getEntryTime().isBefore(eightHoursAgo))
            .count();
        
        if (longParked > 0) {
            log.warn("ALERT: {} vehicles have been parked for more than 8 hours!", longParked);
            analyticsCache.put("longParkedCount", longParked);
        }
    }
    
    /**
     * Generate daily parking report
     */
    @Scheduled(cron = "0 0 23 * * ?") // Every day at 11 PM
    public void generateDailyReport() {
        log.info("=== Generating Daily Parking Report for {} ===", LocalDate.now());
        long todaySessions = sessionRepository.countTodaySessions(LocalDate.now().atStartOfDay());
        log.info("Total sessions today: {}", todaySessions);
    }
}
