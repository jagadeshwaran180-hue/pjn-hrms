package com.pjn.hrms.location;

import java.util.UUID;

public record WorkLocationDto(
        UUID id,
        UUID tenantId,
        String name,
        double latitude,
        double longitude,
        double radiusMeters,
        double accuracyThresholdMeters
) {}
