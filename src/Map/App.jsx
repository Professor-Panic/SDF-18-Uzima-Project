import { useEffect, useRef } from "react";
import L from "leaflet";
import axios from "axios"
import "leaflet/dist/leaflet.css";
import "./App.css";

const OVERPASS_ENDPOINTS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    
];

export function ShowMap() {
    const mapElementRef = useRef(null);

    useEffect(() => {
        if (!mapElementRef.current) {
            return undefined;
        }

        const map = L.map(mapElementRef.current).setView(
            [-1.28333, 36.81667],
            13
        );

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);

        const facilityLayer = L.layerGroup().addTo(map);

        let requestController = null;
        let refreshTimer = null;

        async function refreshFacilities() {
            // Cancel the previous request if the user moved the map again.
            requestController?.abort();
            requestController = new AbortController();

            try {
                const facilities = await getFacilities(
                    map,
                    requestController.signal
                );

                facilityLayer.clearLayers();

                const addedFacilities = new Set();

                for (const facility of facilities) {
                    const key = `${facility.type}/${facility.id}`;

                    // Prevent the same OSM object from being added twice.
                    if (addedFacilities.has(key)) {
                        continue;
                    }

                    addedFacilities.add(key);

                    const latitude =
                        facility.lat ?? facility.center?.lat;

                    const longitude =
                        facility.lon ?? facility.center?.lon;

                    if (
                        latitude === undefined ||
                        longitude === undefined
                    ) {
                        continue;
                    }

                    const tags = facility.tags ?? {};
                    const name = tags.name ?? "Unnamed facility";
                    const facilityType = getFacilityType(tags);

                    L.marker([latitude, longitude])
                        .bindPopup(`
                            <strong>${escapeHtml(name)}</strong>
                            <br>
                            ${escapeHtml(facilityType)}
                        `)
                        .addTo(facilityLayer);
                }

                console.log(
                    `Displayed ${addedFacilities.size} facilities`
                );
            } catch (error) {
                if (axios.isCancel(error) ||error.code === "ERR_CANCELED") {
                    return;
                }
                console.error("Facility request failed:", error);
            }
        }

        function scheduleRefresh() {
            // Wait briefly in case several map events happen together.
            clearTimeout(refreshTimer);

            refreshTimer = setTimeout(() => {
                refreshFacilities();
            }, 1000);
        }

        refreshFacilities();

        // Refresh after the user finishes panning or zooming.
        map.on("moveend", scheduleRefresh);

        return () => {
            clearTimeout(refreshTimer);
            requestController?.abort();
            map.off("moveend", scheduleRefresh);
            map.remove();
        };
    }, []);

    return <div ref={mapElementRef} id="map" />;
}
export async function getFacilities(map, signal) {
    const bounds = map.getBounds();

    const bbox = [
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast()
    ].join(",");

    const query = `
        [out:json][timeout:60];

        (
            nwr["amenity"="hospital"](${bbox});
            nwr["healthcare"="hospital"](${bbox});
            nwr["healthcare"="counselling"](${bbox});
            nwr["healthcare"="psychotherapist"](${bbox});
        );

        out center tags;
    `;

    let lastError = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            console.log(`Trying Overpass endpoint: ${endpoint}`);

            const response = await axios.post(
                endpoint,
                new URLSearchParams({
                    data: query
                }),
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },
                    timeout: 15000,
                    signal
                }
            );

            console.log("Overpass response:", response.data);

            return response.data.elements ?? [];
        } catch (error) {
            if (
                axios.isCancel(error) ||
                error.code === "ERR_CANCELED"
            ) {
                throw error;
            }

            console.warn(
                `Overpass endpoint failed: ${endpoint}`,
                {
                    message: error.message,
                    status: error.response?.status,
                    response: error.response?.data
                }
            );

            lastError = error;
        }
    }

    throw lastError ?? new Error(
        "All Overpass endpoints failed"
    );
}
function getFacilityType(tags) {
    if (
        tags.amenity === "hospital" ||
        tags.healthcare === "hospital"
    ) {
        return "Hospital";
    }

    if (tags.healthcare === "counselling") {
        return "Counselling centre";
    }

    if (tags.healthcare === "psychotherapist") {
        return "Psychotherapist";
    }

    return "Healthcare facility";
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = String(value);

    return element.innerHTML;
}