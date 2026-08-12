import { useState } from "react";

// Decides whether a given 24-hour time string counts as "Morning" or "Evening".
function deriveTimeLabel(scheduledTime) {
   const hour = parseInt(scheduledTime.split(":")[0], 10); //split time into an array, grabs just the first piece, the hour, converts that string into an actual number
   return hour < 12 ? "Morning" : "Evening"; // <Familiar ternary>. Anything before noon (hour 12) counts as Morning, everything else Evening
}

export default function AddMedicationForm({ onAdd }) {
   const [name, setName] = useState("");
   const [dosage, setDosage] = useState("");
   const [quantityPerDose, setQuantityPerDose] = useState("");
   const [scheduledTime, setScheduledTime] = useState("");
   const [quantityRemaining, setQuantityRemaining] = useState("");
   const [submitting, setSubmitting] = useState("");

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
         setScheduledTime("");
         setQuantityRemaining("");
      } catch (error) {
         console.error("Failed to add medication:", error);
      } finally {
         setSubmitting(false);
      }
   }
}
