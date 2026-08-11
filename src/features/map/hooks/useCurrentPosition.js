import { useEffect, useState } from "react";

export default function useCurrentPosition() {
    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                setUserPosition([position.coords.latitude, position.coords.longitude]);
            },
            error => {
                console.error("Failed to get location:", error);
            }
        );
    }, []);

    return userPosition;
}