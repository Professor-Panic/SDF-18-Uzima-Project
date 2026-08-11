import L from "leaflet";
import { useEffect, useRef } from "react";
import iconRed from "../../../Map/assets/red-marker.webp";
import { escapeHtml, isWithinBounds } from "../lib/facilities";
import "leaflet/dist/leaflet.css";

const redIcon = L.icon({
    iconUrl: iconRed,
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function renderFacilitiesInView(map, facilityLayer, facilities) {
    facilityLayer.clearLayers();

    if (!facilities.length) {
        return;
    }

    const bounds = map.getBounds();

    for (const facility of facilities) {
        if (!isWithinBounds(bounds, facility)) {
            continue;
        }

        L.marker([facility.lat, facility.lon], { icon: redIcon })
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

export default function MapCanvas({ currentPosition, facilities }) {
    const mapElementRef = useRef(null);
    const mapRef = useRef(null);
    const facilityLayerRef = useRef(null);
    const currentMarkerRef = useRef(null);
    const facilitiesRef = useRef([]);

    useEffect(() => {
        if (!mapElementRef.current) {
            return;
        }

        const map = L.map(mapElementRef.current).setView([-1.28333, 36.81667], 16);
        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            minZoom: 15,
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        const facilityLayer = L.layerGroup().addTo(map);
        facilityLayerRef.current = facilityLayer;

        function refreshVisibleMarkers() {
            renderFacilitiesInView(map, facilityLayer, facilitiesRef.current);
        }

        map.on("moveend", refreshVisibleMarkers);

        return () => {
            map.off("moveend", refreshVisibleMarkers);
            map.remove();

            mapRef.current = null;
            facilityLayerRef.current = null;
            currentMarkerRef.current = null;
        };
    }, []);

    useEffect(() => {
        facilitiesRef.current = facilities;

        if (mapRef.current && facilityLayerRef.current) {
            renderFacilitiesInView(mapRef.current, facilityLayerRef.current, facilities);
        }
    }, [facilities]);

    useEffect(() => {
        if (!currentPosition || !mapRef.current) {
            return;
        }

        if (currentMarkerRef.current) {
            currentMarkerRef.current.setLatLng(currentPosition);
            mapRef.current.setView(currentPosition, Math.max(mapRef.current.getZoom(), 16));
            return;
        }

        currentMarkerRef.current = L.circleMarker(currentPosition, {
            radius: 8,
            weight: 3,
            color: "#0f7a65",
            fillColor: "#18a37f",
            fillOpacity: 1,
        })
            .bindPopup("<strong>Current Position</strong>")
            .addTo(mapRef.current);

        mapRef.current.setView(currentPosition, 16);
    }, [currentPosition]);

    return (
        <div className="map-panel">
            <div
                ref={mapElementRef}
                id="map"
                className="map-canvas"
            />
        </div>
    );
}