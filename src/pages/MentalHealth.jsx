import PageSection from "../components/layout/PageSection";

export default function MentalHealthPage() {
    return (
        <PageSection
            eyebrow="Wellbeing"
            title="Mental Health"
            description="A lightweight placeholder page for testing route transitions and shared UI."
            highlights={[
                {
                    eyebrow: "Mood",
                    title: "Daily check-in",
                    description: "Capture how the day is going and spot patterns later.",
                },
                {
                    eyebrow: "Tools",
                    title: "Grounding exercises",
                    description: "Keep practical support within one click of the sidebar.",
                },
                {
                    eyebrow: "Care",
                    title: "Follow-up notes",
                    description: "Use this page as a future container for clinician workflow.",
                },
            ]}
        />
    );
}