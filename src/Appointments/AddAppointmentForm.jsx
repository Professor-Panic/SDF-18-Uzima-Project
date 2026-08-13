import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import { buildGoogleCalendarUrl } from "./googleCalendar";

// Form for logging a new appointment — also reused for editing an existing one.
// onAdd/onUpdate: which one gets called depends on whether we're editing.
// editingAppointment: the appointment being edited, or null/undefined if we're adding a new one.
// initialDateTime: prefilled date when opened via a calendar day click (add mode only).
export default function AddAppointmentForm({
   onAdd,
   onUpdate,
   editingAppointment,
   initialDateTime,
}) {
   const [clinicNameManual, setClinicNameManual] = useState("");
   const [dateTime, setDateTime] = useState(initialDateTime ?? null);
   const [reason, setReason] = useState("");
   const [submitting, setSubmitting] = useState(false);
   const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);

   // true whenever we were handed an appointment to edit, false when adding a new one
   const isEditing = Boolean(editingAppointment);

   // Whenever the parent hands us an appointment to edit, fill the form with its
   // current values. When there's nothing to edit, fall back to whatever prefilled
   // date the calendar click supplied (or blank, if opened via "+ Book Visit").
   useEffect(() => {
      if (editingAppointment) {
         setClinicNameManual(editingAppointment.clinicNameManual);
         setDateTime(new Date(editingAppointment.dateTime));
         setReason(editingAppointment.reason || "");
      } else {
         setClinicNameManual("");
         setDateTime(initialDateTime ?? null);
         setReason("");
      }
   }, [editingAppointment, initialDateTime]);

   async function handleSubmit(e) {
      e.preventDefault();

      //If clinic name or date/time is empty, stop the function right there
      if (!clinicNameManual || !dateTime) return;

      setSubmitting(true);
      try {
         if (isEditing) {
            // Editing: overwrite the existing appointment's details.
            // No Google Calendar push here — we don't want a duplicate
            // calendar event created just because a typo got fixed.
            await onUpdate(editingAppointment.id, {
               clinicNameManual,
               dateTime,
               reason,
            });
         } else {
            // Adding: create a brand new appointment.
            await onAdd({ clinicNameManual, dateTime, reason });

            // open Google Calendar's prefilled "add event" screen in a new tab,
            // only if the user actually opted in via the checkbox
            if (addToGoogleCalendar) {
               window.open(
                  buildGoogleCalendarUrl({
                     clinicNameManual,
                     dateTime,
                     reason,
                  }),
                  "_blank",
               );
            }
         }

         setClinicNameManual("");
         setDateTime(null);
         setReason("");
         setAddToGoogleCalendar(false);
      } catch (error) {
         console.error("Failed to save appointment:", error);
      } finally {
         setSubmitting(false);
      }
   }

   //The form
   return (
      <div>
         <form className="styled-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit appointment" : "Add an appointment"}</h3>

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
                  minDate={new Date()} // can't pick a date/time that's already passed
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

            {/* Only offered when adding a NEW appointment — editing shouldn't
                push a second calendar event for the same visit */}
            {!isEditing && (
               <label className="form-checkbox">
                  <input
                     type="checkbox"
                     checked={addToGoogleCalendar}
                     onChange={(e) => setAddToGoogleCalendar(e.target.checked)}
                  />
                  <span>Also add to Google Calendar</span>
               </label>
            )}

            <button
               className="appointment-btn appointment-btn--primary"
               type="submit"
               disabled={submitting}
            >
               {/* //preventing a double-submit if someone clicks twice quickly. */}
               {submitting
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Add appointment"}
            </button>
            {/* //fallback logic. Shows different button text depending on state. */}
         </form>
      </div>
   );
}
