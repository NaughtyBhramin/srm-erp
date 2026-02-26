package com.srm.parking.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "parking_zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingZone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "zone_name", nullable = false, unique = true)
    private String zoneName;
    
    @Column(name = "zone_code", nullable = false, unique = true)
    private String zoneCode;
    
    @Column(name = "total_slots")
    private Integer totalSlots;
    
    @Column(name = "available_slots")
    private Integer availableSlots;
    
    @Column(name = "vehicle_type")
    private String vehicleType;
    
    @Column(name = "hourly_rate", precision = 8, scale = 2)
    private BigDecimal hourlyRate;
    
    @Column(name = "location_description")
    private String locationDescription;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Computed: occupancy percentage
    @Transient
    public double getOccupancyPercent() {
        if (totalSlots == null || totalSlots == 0) return 0;
        int occupied = totalSlots - (availableSlots != null ? availableSlots : 0);
        return Math.round((double) occupied / totalSlots * 1000.0) / 10.0;
    }
}
