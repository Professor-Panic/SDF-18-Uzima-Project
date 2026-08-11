import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import icon_red from "./assets/red-marker.webp";
import GetCurrentPos from "./Current_pos";
const FACILITIES_URL="https://professor-panic.github.io/uzima_json/healthcare_facilities.json"
const redIcon = L.icon({
    iconUrl: icon_red,
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

function normalizeFacility(feature) {
    if (!feature) return null;
    const properties = feature.properties ?? {};
    const coordinates = feature.geometry?.coordinates ?? [];
    const longitude = Number(
        coordinates[0] ?? properties.Longitude
    );
    const latitude = Number(
        coordinates[1] ?? properties.Latitude
    );
    if (!Number.isFinite(latitude) ||!Number.isFinite(longitude)) {
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
        name:properties.Facility_N?.trim() ||"Unnamed facility",
        facilityType:properties.Type?.trim() ||"Healthcare facility",
        owner:properties.Owner?.trim() ||"Unknown",
        county:properties.County?.trim() ||"Unknown",
        subCounty:properties.Sub_County?.trim() ||"Unknown",
        nearestTo:properties.Nearest_To?.trim() ||""
    };
}

function isWithinBounds(bounds, facility) {
    return (
        facility.lat >= bounds.getSouth() &&
        facility.lat <= bounds.getNorth() &&
        facility.lon >= bounds.getWest() &&
        facility.lon <= bounds.getEast()
    );
}

function renderFacilitiesInView(map,facilityLayer,facilities) {
    facilityLayer.clearLayers();
    //Check if the facilites are empty
    if (!facilities.length) return;

    const bounds = map.getBounds();
    //if it isn't empty
    //Draw all facilitie in the vieq
    for (const facility of facilities) {
        if (!isWithinBounds(bounds, facility)) {
            continue;
        }

        L.marker(
            [facility.lat, facility.lon],
            { icon: redIcon }
        )
        .bindPopup(
            `
            <strong>${escapeHtml(facility.name)}</strong><br>
            ${escapeHtml(facility.facilityType)}<br>
            ${escapeHtml(facility.county)}
            `
        )
        .addTo(facilityLayer);
    }
}

export function ShowMap() {
    const mapElementRef = useRef(null);
    const mapRef = useRef(null);
    const facilityLayerRef = useRef(null);
    const currentMarkerRef = useRef(null);
    const facilitiesRef = useRef([]);

    const [facilities, setFacilities] = useState([]);
    const [hospDistances, setHospDistances] = useState([]);
    const [loadError, setLoadError] = useState("");

    const cur_pos = GetCurrentPos();
    //at the start create the map
    useEffect(() => {
        if (!mapElementRef.current) {
            return;
        }
        const map = L.map(mapElementRef.current).setView(
            [-1.28333, 36.81667],
            16
        );
        mapRef.current = map;
        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                minZoom: 15,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);

        const facilityLayer =L.layerGroup().addTo(map);
        facilityLayerRef.current =facilityLayer;

        function refreshVisibleMarkers() {
            renderFacilitiesInView(map,facilityLayer,facilitiesRef.current);
        }

        map.on("moveend",refreshVisibleMarkers);
        return () => {
            map.off("moveend",refreshVisibleMarkers);
            map.remove();

            mapRef.current = null;
            facilityLayerRef.current = null;
            currentMarkerRef.current = null;
        };
    }, []);
    useEffect(() => {
        const controller =new AbortController();
        async function loadFacilities() {
            try {
                setLoadError("");
                const response = await fetch(
                    FACILITIES_URL,
                    {
                        signal: controller.signal
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to load facilities JSON: ${response.status} ${response.statusText}`);
                }

                const data =await response.json();

                if (data?.type !== "FeatureCollection" ||!Array.isArray(data.features)) {
                    throw new Error(
                        "Facility JSON is not a valid GeoJSON FeatureCollection"
                    );
                }

                const normalized =data.features.map(normalizeFacility).filter(Boolean);
                facilitiesRef.current =normalized;
                setFacilities(normalized);

                if (mapRef.current &&facilityLayerRef.current) {
                    renderFacilitiesInView(
                        mapRef.current,
                        facilityLayerRef.current,
                        normalized
                    );
                }

                console.log(`Loaded ${normalized.length} healthcare facilities from JSON`);
            }
            catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.error("Failed to load healthcare facilities:",error);

                setLoadError(error.message);
            }
        }

        loadFacilities();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (!cur_pos ||!mapRef.current) {
            return;
        }

        if (currentMarkerRef.current) {
            currentMarkerRef.current.setLatLng(cur_pos);
            return;
        }

        currentMarkerRef.current =L.marker(cur_pos,
                {
                    radius: 8,
                    weight: 3,
                    fillOpacity: 1
                }
            )
            .bindPopup("<strong>Current Position</strong>")
            .addTo(mapRef.current);
        //Every time the current position changes,change the view
        mapRef.current.setView(cur_pos);
    }, [cur_pos]);
    //Now if there are available facililites and the curent position isn't null
    //calculate the distances
    useEffect(() => {
        if (!cur_pos ||facilities.length === 0) {
            setHospDistances([]);
            return;
        }
        //Find all distances then sort them according to proximity of the user
        const distances =facilities.map(facility => ({
                ...facility,
                distanceKm: haversine(cur_pos[0],cur_pos[1],facility.lat,facility.lon)
            }))
            .sort((a, b) =>a.distanceKm -b.distanceKm);

        setHospDistances(distances);
        if (distances.length) {
            console.log("Closest facility:",distances[0].name);
            console.log(`Closest distance: ${distances[0].distanceKm.toFixed(2)} km`);
        }
    }, [cur_pos, facilities]);

    return (
        <>
            <div
                ref={mapElementRef}
                id="map"
            />

            {loadError && (
                <p className="facility-load-error">
                    {loadError}
                </p>
            )}

            <ul className="hos-distances-list">
                {hospDistances.filter(facility =>facility.distanceKm < 1.0)
                    .map(
                        facility => (
                            <li key={facility.key}className="hos-distances">
                                <p>{facility.name}</p>
                                <p>{facility.facilityType}</p>
                                <p>{facility.distanceKm.toFixed(2)} km</p>
                            </li>
                        )
                    )}
            </ul>
        </>
    );
}

function escapeHtml(value) {
    const element =document.createElement("div");
    element.textContent =String(value);
    return element.innerHTML;
}
//I use this to calculate the straight line distances from where I am to the hopitals
//though this can be improved to follor road distances its too complex for the project
export function haversine(lat1,lon1,lat2,lon2) {
    const dLat =(lat2 - lat1) *Math.PI /180;

    const dLon =(lon2 - lon1) *Math.PI /180;

    lat1 =lat1 *Math.PI /180;

    lat2 =lat2 *Math.PI /180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 *
        Math.cos(lat1) *
        Math.cos(lat2);

    const c =2 *Math.asin(Math.sqrt(a));
    return 6371 * c;
}