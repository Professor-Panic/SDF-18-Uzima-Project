// Handles all data operations for the Medications feature.
let mockMedications = [
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

const fakeDelay = (ms = 500) =>
   new Promise((resolve) => setTimeout(resolve, ms));

// Fetches all medications belonging to a specific user, soonest first.
export async function getMedications(userId) {
   await fakeDelay(); //simulating a real network request
   return mockMedications
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

   mockMedications.push(newMedication);
   return newMedication;
}

//Update Medication status
export async function toggleMedicationTaken(id) {
   await fakeDelay(); // simulating a real network request

   mockMedications = mockMedications.map((medication) =>
      medication.id === id
         ? { ...medication, taken: !medication.taken }
         : medication,
   ); //If this Medication's id matches the id we're looking for, return an updated copy. Otherwise, return the Medication unchanged.

   return mockMedications.find((medication) => medication.id === id);
}
