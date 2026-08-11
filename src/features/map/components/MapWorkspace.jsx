import { useMemo } from "react";
import MapCanvas from "./MapCanvas";
import NearbyFacilitiesPanel from "./NearbyFacilitiesPanel";
import useCurrentPosition from "../hooks/useCurrentPosition";
import useFacilities from "../hooks/useFacilities";
import { haversine } from "../lib/facilities";

export default function MapWorkspace() {
    const currentPosition = useCurrentPosition();
    const { facilities, loadError } = useFacilities();

    const nearbyFacilities = useMemo(() => {
        if (!currentPosition || !facilities.length) {
            return [];
        }

        return facilities
            .map(facility => ({
                ...facility,
                distanceKm: haversine(currentPosition[0], currentPosition[1], facility.lat, facility.lon),
            }))
            .sort((a, b) => a.distanceKm - b.distanceKm);
    }, [currentPosition, facilities]);

    return (
        <section className="map-workspace">
            {loadError && (
                <p className="facility-load-error">
                    {loadError}
                </p>
            )}

            <div className="map-grid">
                <MapCanvas
                    currentPosition={currentPosition}
                    facilities={facilities}
                />

                <NearbyFacilitiesPanel
                    facilities={nearbyFacilities.filter(facility => facility.distanceKm < 1)}
                />
            </div>
        </section>
    );
}