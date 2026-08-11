import MapWorkspace from "../features/map/components/MapWorkspace";

export default function MapPage() {
    return (
        <>
            <section className="app-main__hero">
                <div>
                    <p className="app-eyebrow">Live care routing</p>
                    <h1>Find the nearest support without losing the bigger picture.</h1>
                    <p className="app-subtitle">
                        A calm, map-first workspace for locating facilities and reviewing nearby care options.
                    </p>
                </div>

                <div className="app-hero__chip">
                    16 facilities near your current position
                </div>
            </section>

            <MapWorkspace />
        </>
    );
}