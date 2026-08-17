import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import { buildGoogleCalendarUrl } from "./googleCalendar";
import {
   getSelectableTimeRange,
   validateRequiredText,
   toUserMessage,
} from "./FormValidation";

// Form for logging a new appointment, also reused for editing an existing one.

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

   // Holds a user-facing message when validation fails or the save itself fails (network/server error) — shown inline instead of failing silently.
   const [formError, setFormError] = useState(null);

   // true whenever we were handed an appointment to edit, false when adding a new one
   const isEditing = Boolean(editingAppointment);

   // Whenever the parent hands us an appointment to edit, fill the form with its current values. When there's nothing to edit, fall back to whatever prefilled date the calendar click supplied
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

      // switching between add/edit (or between two different appointments to edit) should always clear out any leftover error from a previous attempt
      setFormError(null);
   }, [editingAppointment, initialDateTime]);

   // The appointment's original time, if we're editing one gets included
   const originalTime = editingAppointment
      ? new Date(editingAppointment.dateTime)
      : null;
   const { minTime, maxTime } = getSelectableTimeRange(dateTime, originalTime);

   async function handleSubmit(e) {
      e.preventDefault();
      setFormError(null);

      // Real validation instead of relying solely on the browser's native `required`
      const nameError = validateRequiredText(clinicNameManual, "Clinic name");
      if (nameError) {
         setFormError(nameError);
         return;
      }
      if (!dateTime) {
         setFormError("Please select a date & time.");
         return;
      }

      setSubmitting(true);
      try {
         if (isEditing) {
            // Editing: overwrite the existing appointment's details.
            await onUpdate(editingAppointment.id, {
               clinicNameManual: clinicNameManual.trim(),
               dateTime,
               reason: reason.trim(),
            });
         } else {
            // Adding: create a brand new appointment.
            await onAdd({
               clinicNameManual: clinicNameManual.trim(),
               dateTime,
               reason: reason.trim(),
            });

            // open Google Calendar's prefilled "add event" screen in a new tab,<optional>
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
         // Inform the user of a failed save instead of only logging it
         console.error("Failed to save appointment:", error);
         setFormError(
            toUserMessage(
               error,
               "Couldn't save this appointment. Please try again.",
            ),
         );
      } finally {
         setSubmitting(false);
      }
   }

   //The form
   return (
      <div>
         <form className="styled-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit appointment" : "Add an appointment"}</h3>

            {formError && <p className="form-error">{formError}</p>}

            {/* clinicNameManual */}
            <label className="form-field">
               <span>Clinic / Provider name</span>
               <input
                  type="text"
                  value={clinicNameManual}
                  onChange={(e) => setClinicNameManual(e.target.value)}
                  placeholder="e.g. Cascade Menta Wellness"
                  maxLength={120} // soft cap so a pasted paragraph can't blow out the card layout
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
                  minDate={new Date()} // can't pick a date that's already passed
                  minTime={minTime} // if today is selected, can't pick a time earlier than right now
                  maxTime={maxTime} // paired with minTime — react-datepicker requires both when either is set
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
                  maxLength={200}
               />
            </label>

            {/* Only offered when adding a NEW appointment  */}
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
