// Small colored badge showing an appointment's current status
// (Upcoming, Completed, or Missed).

const StatusStyles = {
   upcoming: { label: "Upcoming", backgroundColor: "#fff", color: "#1C63B7" },
   completed: { label: "Completed", backgroundColor: "#fff", color: "#187C4D" },
   missed: { label: "Missed", backgroundColor: "#fff", color: "#C4453C" },
};

export default function AppointmentStatusBadge({ status }) {
   const style = StatusStyles[status] ?? StatusStyles.upcoming; //use the left side, unless it's null or undefined, in which case fall back to the right side.

   return (
      <span
         style={{
            backgroundColor: style.backgroundColor,
            color: style.color,
         }}
      >
         {style.label}
      </span>
   );
}
