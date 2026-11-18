package com.pjn.hrms.location;

import org.springframework.stereotype.Service;

@Service
public class GeofenceService {

    private static final double EARTH_RADIUS_METERS = 6371000.0;

    /**
     * Compute great-circle distance between two GPS coordinates using Haversine formula.
     */
    public double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Validates whether a device location is within office radius (default 100 meters).
     */
    public boolean isWithinGeofence(double devLat, double devLon, double officeLat, double officeLon, double radiusMeters) {
        return calculateDistanceMeters(devLat, devLon, officeLat, officeLon) <= radiusMeters;
    }

    /**
     * Evaluates GPS accuracy freshness threshold.
     */
    public boolean isAccuracyAcceptable(double accuracyMeters, double maxAllowedThresholdMeters) {
        return accuracyMeters <= maxAllowedThresholdMeters;
    }
}
