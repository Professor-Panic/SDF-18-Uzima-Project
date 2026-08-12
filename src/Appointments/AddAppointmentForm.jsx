import { useState } from "react";

// Form for logging a new appointment.
export default function AddAppointmentForm({ onAdd }) {
   const [clinicNameManual, setClinicNameManual] = useState("");
   const [dateTime, setDateTime] = useState("");
   const [reason, setReason] = useState("");
   const [submitting, setSubmitting] = useState(false);

   async function handleSubmit(e) {
      e.preventDefault();

      //If clinic name or date/time is empty, stop the function right there
      if (!clinicNameManual || !dateTime) return;

      setSubmitting(true);
      try {
         await onAdd({ clinicNameManual, dateTime, reason });

         setClinicNameManual("");
         setDateTime("");
         setReason("");
      } catch (error) {
         console.error("Failed to add appointment:", error);
      } finally {
         setSubmitting(false);
      }
   }

   //The form
   return (
      <div>
         <form onSubmit={handleSubmit}>
            <h3>Add an appointment</h3>
            {/* clinicNameManual */}
            <label>
               Clinic / Provider name
               <input
                  type="text"
                  value={clinicNameManual}
                  onChange={(e) => setClinicNameManual(e.target.value)}
                  placeholder="e.g. Cascade Menta Wellness"
                  required
               />
            </label>
            {/* Date & Time */}
            <label>
               Date & Time
               <input
                  type="datetime-local" //a built-in HTML input type that gives the user a native date-and-time picker widget
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
               />
            </label>
            {/* Reason */}
            <label>
               Reason
               <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
               />
            </label>
            <button type="submit" disabled={submitting}>
               {/* //preventing a double-submit if someone clicks twice quickly. */}
               {submitting ? "Adding..." : "Add appointment"}
            </button>
            {/* //fallback logic. Shows different button text depending on state. */}
         </form>
      </div>
   );
}
