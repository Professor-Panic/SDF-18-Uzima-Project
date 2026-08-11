import PageSection from "../components/layout/PageSection";

export default function AppointmentsPage() {
    return (
        <PageSection
            eyebrow="Scheduling"
            title="Appointments"
            description="A route stub for schedule management, used here to verify the sidebar links."
            highlights={[
                {
                    eyebrow: "Upcoming",
                    title: "Visit list",
                    description: "Review the next appointments in a compact, readable layout.",
                },
                {
                    eyebrow: "Changes",
                    title: "Reschedule flow",
                    description: "This slot can later hold actions and calendar controls.",
                },
                {
                    eyebrow: "Reminders",
                    title: "Notification status",
                    description: "Keep one consistent place for notification and attendance info.",
                },
            ]}
        />
    );
}