package com.pjn.hrms.location;

import com.pjn.hrms.tenant.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/work-locations")
public class WorkLocationController {

    private final Map<UUID, WorkLocationDto> locationDb = new ConcurrentHashMap<>();
    private final GeofenceService geofenceService;

    public WorkLocationController(GeofenceService geofenceService) {
        this.geofenceService = geofenceService;
        // Seed default Bengaluru HQ location (100m radius)
        UUID defaultTenant = UUID.nameUUIDFromBytes("PJN-TECH".getBytes());
        UUID defaultLocId = UUID.nameUUIDFromBytes("Bengaluru-HQ".getBytes());
        locationDb.put(defaultLocId, new WorkLocationDto(
                defaultLocId, defaultTenant, "Bengaluru HQ", 12.9716, 77.5946, 100.0, 30.0
        ));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'HR')")
    public ResponseEntity<WorkLocationDto> createLocation(@RequestBody WorkLocationDto dto) {
        UUID tenantId = TenantContext.getTenantId();
        UUID id = dto.id() != null ? dto.id() : UUID.randomUUID();
        WorkLocationDto created = new WorkLocationDto(
                id, tenantId, dto.name(), dto.latitude(), dto.longitude(),
                dto.radiusMeters() > 0 ? dto.radiusMeters() : 100.0,
                dto.accuracyThresholdMeters() > 0 ? dto.accuracyThresholdMeters() : 30.0
        );
        locationDb.put(id, created);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<WorkLocationDto>> listLocations() {
        UUID tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(locationDb.values().stream()
                .filter(l -> tenantId == null || tenantId.equals(l.tenantId()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/validate-distance")
    public ResponseEntity<Map<String, Object>> validateDistance(
            @RequestParam double devLat,
            @RequestParam double devLon,
            @RequestParam UUID officeLocationId) {
        WorkLocationDto office = locationDb.get(officeLocationId);
        if (office == null) {
            return ResponseEntity.notFound().build();
        }

        double distance = geofenceService.calculateDistanceMeters(devLat, devLon, office.latitude(), office.longitude());
        boolean withinGeofence = distance <= office.radiusMeters();

        return ResponseEntity.ok(Map.of(
                "distanceMeters", distance,
                "radiusMeters", office.radiusMeters(),
                "withinGeofence", withinGeofence
        ));
    }
}
