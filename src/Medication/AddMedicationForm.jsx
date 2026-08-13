import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function formatTimeForStorage(date) {
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");
   return `${hours}:${minutes}`;
}

// Builds a Date object from a stored "HH:mm" string, so DatePicker can display it.
// (DatePicker needs a real Date, but we store time as a plain string.)
function parseStoredTime(timeString) {
   if (!timeString) return null;
   const [hours, minutes] = timeString.split(":").map(Number);
   const date = new Date();
   date.setHours(hours, minutes, 0, 0);
   return date;
}

// Decides whether a given 24-hour time string counts as "Morning" or "Evening".
function deriveTimeLabel(scheduledTime) {
   // const hour = parseInt(scheduledTime.split(":")[0], 10); //split time into an array, grabs just the first piece, the hour, converts that string into an actual number
   const hour = scheduledTime.getHours(); // now a Date, so .getHours() directly — no string-splitting needed
   return hour < 12 ? "Morning" : "Evening"; // <Familiar ternary>. Anything before noon (hour 12) counts as Morning, everything else Evening
}

export default function AddMedicationForm({
   onAdd,
   onUpdate,
   editingMedication,
}) {
   const [name, setName] = useState("");
   const [dosage, setDosage] = useState("");
   const [quantityPerDose, setQuantityPerDose] = useState("");
   const [scheduledTime, setScheduledTime] = useState(null);
   const [quantityRemaining, setQuantityRemaining] = useState("");
   const [submitting, setSubmitting] = useState(false);

   const isEditing = Boolean(editingMedication);

   // Whenever the parent hands us a medication to edit, fill the form with
   // its current values, converting the stored "HH:mm" string back into a
   // Date so DatePicker can display it correctly.
   useEffect(() => {
      if (editingMedication) {
         setName(editingMedication.name);
         setDosage(editingMedication.dosage);
         setQuantityPerDose(editingMedication.quantityPerDose || "");
         setScheduledTime(parseStoredTime(editingMedication.scheduledTime));
         setQuantityRemaining(
            String(editingMedication.quantityRemaining ?? ""),
         );
      } else {
         setName("");
         setDosage("");
         setQuantityPerDose("");
         setScheduledTime(null);
         setQuantityRemaining("");
      }
   }, [editingMedication]);

   async function handleSubmit(e) {
      e.preventDefault();

      //If name, dosage or scheduledTime is empty, stop the function right there
      if (!name || !dosage || !scheduledTime) return;

      setSubmitting(true);
      try {
         const payload = {
            name,
            dosage,
            quantityPerDose,
            scheduledTime: formatTimeForStorage(scheduledTime),
            timeLabel: deriveTimeLabel(scheduledTime), //instead of trusting a form field for timeLabel, we compute it right here, guaranteeing it always correctly matches whatever scheduledTime was actually picked
            quantityRemaining: Number(quantityRemaining), //converts it properly to a number
         };

         if (isEditing) {
            await onUpdate(editingMedication.id, payload);
         } else {
            await onAdd(payload);
         }

         setName("");
         setDosage("");
         setQuantityPerDose("");
         setScheduledTime(null);
         setQuantityRemaining("");
      } catch (error) {
         console.error("Failed to add medication:", error);
      } finally {
         setSubmitting(false);
      }
   }

   return (
      <form className="styled-form" onSubmit={handleSubmit}>
         <h3>{isEditing ? "Edit medication" : "Add a medication"}</h3>

         <label className="form-field">
            <span>Name</span>
            <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="e.g. Atorvastatin"
               required
            />
         </label>

         <label className="form-field">
            <span>Dosage</span>
            <input
               type="text"
               value={dosage}
               onChange={(e) => setDosage(e.target.value)}
               placeholder="e.g. 20mg"
               required
            />
         </label>

         <label className="form-field">
            <span>Quantity per dose</span>
            <input
               type="text"
               value={quantityPerDose}
               onChange={(e) => setQuantityPerDose(e.target.value)}
               placeholder="e.g. 1 Tablet"
            />
         </label>

         <div className="form-field">
            <span>Scheduled time</span>
            <DatePicker
               selected={scheduledTime}
               onChange={(time) => setScheduledTime(time)}
               showTimeSelect
               showTimeSelectOnly //hides the calendar grid entirely and shows only the scrolling time list.
               timeIntervals={15}
               dateFormat="h:mm aa"
               placeholderText="Select time"
               className="datetime-trigger"
               required
            />
         </div>

         <label className="form-field">
            <span>Quantity remaining</span>
            <input
               type="number"
               value={quantityRemaining}
               onChange={(e) => setQuantityRemaining(e.target.value)}
               placeholder="e.g. 30"
            />
         </label>

         <button
            className="appointment-btn appointment-btn--primary"
            type="submit"
            disabled={submitting}
         >
            {submitting
               ? "Saving..."
               : isEditing
                 ? "Save Changes"
                 : "Add medication"}
         </button>
      </form>
   );
}
