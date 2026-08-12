import { useState } from "react";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// Form for logging a new appointment.
export default function AddAppointmentForm({ onAdd }) {
   const [clinicNameManual, setClinicNameManual] = useState("");
   const [dateTime, setDateTime] = useState(null);
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
         <form className="styled-form" onSubmit={handleSubmit}>
            <h3>Add an appointment</h3>
            {/* clinicNameManual */}
            <label className="form-field">
               <span>Clinic / Provider name</span>
               <input
                  type="text"
                  value={clinicNameManual}
                  onChange={(e) => setClinicNameManual(e.target.value)}
                  placeholder="e.g. Cascade Menta Wellness"
                  required
               />
            </label>
            {/* Date & Time */}
            <div className="form-field">
               <span>Date & Time</span>
               <DatePicker
                  selected={dateTime} //tells the picker which date is currently chosen
                  onChange={(date) => setDateTime(date)}
                  showTimeSelect //merges date-picking and time-picking into a single popover
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select date & time"
                  className="datetime-trigger"
                  required
                  formatWeekDay={(day) => day.charAt(0)}
               />
            </div>
            {/* Reason */}
            <label className="form-field">
               <span>Reason</span>
               <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
               />
            </label>
            <button
               className="appointment-btn appointment-btn--primary"
               type="submit"
               disabled={submitting}
            >
               {/* //preventing a double-submit if someone clicks twice quickly. */}
               {submitting ? "Adding..." : "Add appointment"}
            </button>
            {/* //fallback logic. Shows different button text depending on state. */}
         </form>
      </div>
   );
}
