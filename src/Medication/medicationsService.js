// Handles all data operations for the Medications feature.
// Backed by localStorage instead of a real backend, so data survives page refreshes without needing Firebase or any server

const STORAGE_KEY = "medications_data";

const seedMedications = [
   {
      id: "med_001",
      userId: "user_123",
      name: "Atorvastatin",
      dosage: "20mg",
      quantityPerDose: "1 Tablet",
      timeLabel: "Morning",
      scheduledTime: "08:00",
      taken: true,
      quantityRemaining: 18,
      lowStockThreshold: 5,
   },
   {
      id: "med_002",
      userId: "user_123",
      name: "Lisinopril",
      dosage: "10mg",
      quantityPerDose: "1 Tablet",
      timeLabel: "Morning",
      scheduledTime: "08:00",
      taken: false,
      quantityRemaining: 4,
      lowStockThreshold: 5,
   },
   {
      id: "med_003",
      userId: "user_123",
      name: "Omega-3 Fish Oil",
      dosage: "1000mg",
      quantityPerDose: "2 Capsules",
      timeLabel: "Evening",
      scheduledTime: "20:00",
      taken: false,
      quantityRemaining: 30,
      lowStockThreshold: 5,
   },
];

// Reads the current list from localStorage, and seeds it with the demo data the very first time this runs (so the app never opens completely empty).
function readMedications() {
   try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMedications));
         return [...seedMedications];
      }
      return JSON.parse(raw);
   } catch (error) {
      // Corrupted or unreadable storage (e.g. private browsing mode edge cases) — fall back to seed data rather than crashing the whole app.
      console.error("Failed to read medications from storage:", error);
      return [...seedMedications];
   }
}

function writeMedications(medications) {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
}

const fakeDelay = (ms = 300) =>
   new Promise((resolve) => setTimeout(resolve, ms));

// Fetches all medications belonging to a specific user, soonest first.
export async function getMedications(userId) {
   await fakeDelay(); //simulating a real network request
   return readMedications()
      .filter((medication) => medication.userId === userId) //medications belonging to the person with this userId
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)); //built-in string method that compares two strings and returns a negative number, zero, or positive number
}

//Add a new Medication, when the user fill the Medication form
export async function addMedication(userId, newMedicationData) {
   await fakeDelay(); // simulating a real network request

   const newMedication = {
      id: `med_${Date.now()}`,
      userId,
      taken: false, //a brand new medication entry should always start unchecked
      ...newMedicationData, //takes info from the form
   };

   const medications = readMedications();
   medications.push(newMedication);
   writeMedications(medications);

   return newMedication;
}

//Update Medication status
export async function toggleMedicationTaken(id) {
   await fakeDelay(); // simulating a real network request

   const medications = readMedications().map((medication) =>
      medication.id === id
         ? { ...medication, taken: !medication.taken }
         : medication,
   ); //If this Medication's id matches the id we're looking for, return an updated copy. Otherwise, return the Medication unchanged.
   writeMedications(medications);

   return medications.find((medication) => medication.id === id);
}

export async function deleteMedication(id) {
   await fakeDelay();
   const medications = readMedications().filter(
      (medication) => medication.id !== id,
   );
   writeMedications(medications);
}

// Updates a medication's editable details (not just the taken checkbox).
export async function updateMedication(id, updatedData) {
   await fakeDelay();

   const medications = readMedications().map((medication) =>
      medication.id === id ? { ...medication, ...updatedData } : medication,
   );
   writeMedications(medications);

   return medications.find((medication) => medication.id === id);
}
