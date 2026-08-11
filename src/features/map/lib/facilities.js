export function normalizeFacility(feature) {
    if (!feature) return null;

    const properties = feature.properties ?? {};
    const coordinates = feature.geometry?.coordinates ?? [];
    const longitude = Number(coordinates[0] ?? properties.Longitude);
    const latitude = Number(coordinates[1] ?? properties.Latitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }

    return {
        key: String(
            feature.id ??
            properties.OBJECTID ??
            properties.FID ??
            `${latitude}/${longitude}`
        ),
        lat: latitude,
        lon: longitude,
        name: properties.Facility_N?.trim() || "Unnamed facility",
        facilityType: properties.Type?.trim() || "Healthcare facility",
        owner: properties.Owner?.trim() || "Unknown",
        county: properties.County?.trim() || "Unknown",
        subCounty: properties.Sub_County?.trim() || "Unknown",
        nearestTo: properties.Nearest_To?.trim() || "",
    };
}

export function isWithinBounds(bounds, facility) {
    return (
        facility.lat >= bounds.getSouth() &&
        facility.lat <= bounds.getNorth() &&
        facility.lon >= bounds.getWest() &&
        facility.lon <= bounds.getEast()
    );
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function haversine(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const startLat = lat1 * Math.PI / 180;
    const endLat = lat2 * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 *
        Math.cos(startLat) *
        Math.cos(endLat);

    const c = 2 * Math.asin(Math.sqrt(a));

    return 6371 * c;
}