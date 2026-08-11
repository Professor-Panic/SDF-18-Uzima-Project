import { useEffect, useState } from "react";
import { normalizeFacility } from "../lib/facilities";

const FACILITIES_URL = "https://professor-panic.github.io/uzima_json/healthcare_facilities.json";

export default function useFacilities() {
    const [facilities, setFacilities] = useState([]);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadFacilities() {
            try {
                setLoadError("");

                const response = await fetch(FACILITIES_URL, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to load facilities JSON: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (data?.type !== "FeatureCollection" || !Array.isArray(data.features)) {
                    throw new Error("Facility JSON is not a valid GeoJSON FeatureCollection");
                }

                const normalized = data.features.map(normalizeFacility).filter(Boolean);
                setFacilities(normalized);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.error("Failed to load healthcare facilities:", error);
                setLoadError(error.message);
            }
        }

        loadFacilities();

        return () => {
            controller.abort();
        };
    }, []);

    return { facilities, loadError };
}