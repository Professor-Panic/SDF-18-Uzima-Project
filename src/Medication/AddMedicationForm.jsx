import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Decides whether a given 24-hour time string counts as "Morning" or "Evening".
function deriveTimeLabel(scheduledTime) {
   // const hour = parseInt(scheduledTime.split(":")[0], 10); //split time into an array, grabs just the first piece, the hour, converts that string into an actual number
   const hour = scheduledTime.getHours(); // now a Date, so .getHours() directly — no string-splitting needed
   return hour < 12 ? "Morning" : "Evening"; // <Familiar ternary>. Anything before noon (hour 12) counts as Morning, everything else Evening
}

export default function AddMedicationForm({ onAdd }) {
   const [name, setName] = useState("");
   const [dosage, setDosage] = useState("");
   const [quantityPerDose, setQuantityPerDose] = useState("");
   const [scheduledTime, setScheduledTime] = useState(null);
   const [quantityRemaining, setQuantityRemaining] = useState("");
   const [submitting, setSubmitting] = useState(false);

   async function handleSubmit(e) {
      e.preventDefault();

      //If name, dosage or scheduledTime is empty, stop the function right there
      if (!name || !dosage || !scheduledTime) return;

      setSubmitting(true);
      try {
         await onAdd({
            name,
            dosage,
            quantityPerDose,
            scheduledTime,
            timeLabel: deriveTimeLabel(scheduledTime), //instead of trusting a form field for timeLabel, we compute it right here, guaranteeing it always correctly matches whatever scheduledTime was actually picked
            quantityRemaining: Number(quantityRemaining), //converts it properly to a number
         });

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
         <h3>Add a medication</h3>

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
            {submitting ? "Adding..." : "Add medication"}
         </button>
      </form>
   );
}
