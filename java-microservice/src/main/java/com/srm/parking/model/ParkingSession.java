package com.srm.parking.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Parking Session Entity - tracks real-time vehicle parking
 */
@Entity
@Table(name = "parking_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "vehicle_id", nullable = false, columnDefinition = "uuid")
    private UUID vehicleId;
    
    @Column(name = "slot_id", nullable = false, columnDefinition = "uuid")
    private UUID slotId;
    
    @Column(name = "zone_id", nullable = false, columnDefinition = "uuid")
    private UUID zoneId;
    
    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;
    
    @Column(name = "exit_time")
    private LocalDateTime exitTime;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "amount_charged", precision = 10, scale = 2)
    private BigDecimal amountCharged;
    
    @Column(name = "payment_status", length = 20)
    private String paymentStatus;
    
    @Column(name = "status", length = 20)
    private String status;
    
    @Column(name = "notes")
    private String notes;
}
