import PageSection from "../components/layout/PageSection";

export default function DashboardPage() {
    return (
        <PageSection
            eyebrow="Overview"
            title="Dashboard"
            description="A simple landing page for testing navigation before the full product layout is expanded."
            highlights={[
                {
                    eyebrow: "Today",
                    title: "Check-ins ready",
                    description: "Review today's entries and keep the workflow moving.",
                },
                {
                    eyebrow: "Status",
                    title: "System online",
                    description: "Navigation, layout, and shared styling are connected.",
                },
                {
                    eyebrow: "Next step",
                    title: "Open the map",
                    description: "Use Service Map to verify the geolocation route is wired correctly.",
                },
            ]}
        />
    );
}