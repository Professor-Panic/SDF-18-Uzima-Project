export default function NearbyFacilitiesPanel({ facilities }) {
    return (
        <aside className="distance-panel">
            <div className="distance-panel__header">
                <p className="distance-panel__eyebrow">Nearby facilities</p>
                <h2>Within 1 km</h2>
                <p className="distance-panel__copy">
                    Prioritized by proximity from your current location.
                </p>
            </div>

            <ul className="hos-distances-list">
                {facilities.length ? (
                    facilities.map(facility => (
                        <li key={facility.key} className="hos-distances">
                            <div>
                                <p className="hos-distances__name">{facility.name}</p>
                                <p className="hos-distances__meta">{facility.facilityType}</p>
                            </div>
                            <p className="hos-distances__distance">{facility.distanceKm.toFixed(2)} km</p>
                        </li>
                    ))
                ) : (
                    <li className="hos-distances hos-distances--empty">
                        <div>
                            <p className="hos-distances__name">No nearby facilities in range</p>
                            <p className="hos-distances__meta">Zoom or move the map to inspect more results.</p>
                        </div>
                    </li>
                )}
            </ul>
        </aside>
    );
}