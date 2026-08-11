import PageSection from "../components/layout/PageSection";

export default function MedicationsPage() {
    return (
        <PageSection
            eyebrow="Medication"
            title="Medications"
            description="A simple route for testing menu behavior and future medication tools."
            highlights={[
                {
                    eyebrow: "Doses",
                    title: "Reminder list",
                    description: "Show the next dose schedule in a clean grid later on.",
                },
                {
                    eyebrow: "Supply",
                    title: "Refill checks",
                    description: "Add refill timing and stock status when the feature grows.",
                },
                {
                    eyebrow: "Adherence",
                    title: "Tracking placeholder",
                    description: "Reserve space for adherence history and clinician notes.",
                },
            ]}
        />
    );
}