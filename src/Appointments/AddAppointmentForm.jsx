import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { buildGoogleCalendarUrl } from "./googleCalendar";

// Form for logging a new appointment.
export default function AddAppointmentForm({ onAdd, initialDateTime }) {
  const [clinicNameManual, setClinicNameManual] = useState("");
  const [dateTime, setDateTime] = useState(initialDateTime ?? null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
  const [error, setError] = useState(null);

  // whenever the parent hands us a new prefilled date (e.g. from clicking
  // a day on the calendar), reflect it in the form
  useEffect(() => {
    setDateTime(initialDateTime ?? null);
  }, [initialDateTime]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // If clinic name or date/time is empty, stop the function right there
    if (!clinicNameManual || !dateTime) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Create the appointment object
      const appointmentData = { 
        clinicNameManual, 
        dateTime, 
        reason 
      };
      
      // Call the parent's onAdd function and wait for it to complete
      const result = await onAdd(appointmentData);
      
      // Optional: Log success for debugging
      console.log("Appointment added successfully:", result);

      // Open Google Calendar's prefilled "add event" screen in a new tab
      if (addToGoogleCalendar) {
        window.open(
          buildGoogleCalendarUrl({ clinicNameManual, dateTime, reason }),
          "_blank",
        );
      }

      // Clear form fields after successful submission
      setClinicNameManual("");
      setDateTime(null);
      setReason("");
      setAddToGoogleCalendar(false);
      
    } catch (error) {
      console.error("Failed to add appointment:", error);
      setError("Failed to add appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // The form
  return (
    <div>
      <form className="styled-form" onSubmit={handleSubmit}>
        <h3>Add an appointment</h3>
        
        {/* Show error if any */}
        {error && (
          <div className="form-error" style={{ 
            color: '#9f1239', 
            background: 'rgba(220,38,38,0.06)', 
            padding: '0.75rem', 
            borderRadius: '0.7rem',
            marginBottom: '1rem',
            border: '1px solid rgba(220,38,38,0.12)'
          }}>
            {error}
          </div>
        )}
        
        {/* Clinic name */}
        <label className="form-field">
          <span>Clinic / Provider name</span>
          <input
            type="text"
            value={clinicNameManual}
            onChange={(e) => setClinicNameManual(e.target.value)}
            placeholder="e.g. Cascade Mental Wellness"
            required
          />
        </label>
        
        {/* Date & Time */}
        <div className="form-field">
          <span>Date & Time</span>
          <DatePicker
            selected={dateTime}
            onChange={(date) => setDateTime(date)}
            showTimeSelect
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
            placeholder="e.g., Follow-up checkup"
          />
        </label>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={addToGoogleCalendar}
            onChange={(e) => setAddToGoogleCalendar(e.target.checked)}
          />
          <span>Also add to Google Calendar</span>
        </label>
        
        <button
          className="appointment-btn appointment-btn--primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add appointment"}
        </button>
      </form>
    </div>
  );
}