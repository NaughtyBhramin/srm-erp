package com.srm.parking.repository;

import com.srm.parking.model.ParkingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, UUID> {
    
    List<ParkingSession> findByStatus(String status);
    
    List<ParkingSession> findByZoneIdAndStatus(UUID zoneId, String status);
    
    Optional<ParkingSession> findByVehicleIdAndStatus(UUID vehicleId, String status);
    
    @Query("SELECT COUNT(ps) FROM ParkingSession ps WHERE ps.status = 'active'")
    long countActiveSessions();
    
    @Query("SELECT COUNT(ps) FROM ParkingSession ps WHERE ps.entryTime >= :startOfDay")
    long countTodaySessions(@Param("startOfDay") LocalDateTime startOfDay);
    
    @Query("SELECT ps FROM ParkingSession ps WHERE ps.entryTime >= :since ORDER BY ps.entryTime DESC")
    List<ParkingSession> findRecentSessions(@Param("since") LocalDateTime since);
}
