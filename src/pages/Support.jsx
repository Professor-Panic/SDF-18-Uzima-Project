import PageSection from "../components/layout/PageSection";

export default function SupportPage() {
    return (
        <PageSection
            eyebrow="Help"
            title="Support"
            description="A minimal support route for navigation testing and future help content."
            highlights={[
                {
                    eyebrow: "Urgent",
                    title: "Emergency contacts",
                    description: "Place critical contact information here when the page matures.",
                },
                {
                    eyebrow: "Guidance",
                    title: "How to get help",
                    description: "Add support links and quick steps in a later pass.",
                },
                {
                    eyebrow: "Follow-up",
                    title: "Case notes",
                    description: "Use this route as a home for support-related workflows.",
                },
            ]}
        />
    );
}