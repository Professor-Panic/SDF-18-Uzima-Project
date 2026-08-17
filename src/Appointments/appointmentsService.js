// Handles all data operations for the Appointments feature.
// Backed by localStorage instead of a real backend, so data survives page refreshes without needing Firebase or any server

const STORAGE_KEY = "appointments_data";

const seedAppointments = [
   {
      id: "apt_001",
      userId: "user_123",
      clinicNameManual: "Cascade Mental Wellness",
      dateTime: "2026-08-18T10:00:00",
      reason: "Therapy follow-up",
      status: "upcoming",
      reminderSent: false,
      followUpNote: "",
   },
   {
      id: "apt_002",
      userId: "user_123",
      clinicNameManual: "MP Shah Hospital",
      dateTime: "2026-08-08T10:00:00",
      reason: "Cardiology follow-up",
      status: "completed",
      reminderSent: false,
      followUpNote: "",
   },
   {
      id: "apt_003",
      userId: "user_123",
      clinicNameManual: "Cascade Mental Wellness",
      dateTime: "2026-08-10T10:00:00",
      reason: "Therapy follow-up",
      status: "missed",
      reminderSent: false,
      followUpNote: "",
   },
];

// Reads the current list from localStorage, and seeds it with the demo data the very first time this runs (so the app never opens completely empty).
function readAppointments() {
   try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAppointments));
         return [...seedAppointments];
      }
      return JSON.parse(raw);
   } catch (error) {
      // Corrupted or unreadable storage (e.g. private browsing mode edge cases) — fall back to seed data rather than crashing the whole app.
      console.error("Failed to read appointments from storage:", error);
      return [...seedAppointments];
   }
}

function writeAppointments(appointments) {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

// Simulates the time it takes to talk to a real database incase of bugs
const fakeDelay = (ms = 300) =>
   new Promise((resolve) => setTimeout(resolve, ms));

// Fetches all appointments belonging to a specific user, soonest first.
export async function getAppointments(userId) {
   await fakeDelay(); //simulating a real network request
   return readAppointments()
      .filter((appointment) => appointment.userId === userId) //appointments belonging to the person with this userId
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)); //orders the results by date, soonest first
}

//Add a new appointment, when the user fill the Appointment form
export async function addAppointment(userId, newAppointmentData) {
   await fakeDelay(); // simulating a real network request

   const newAppointment = {
      id: `apt_${Date.now()}`,
      userId,
      status: "upcoming",
      reminderSent: false,
      followUpNote: "",
      ...newAppointmentData, //takes info from the form
   };

   const appointments = readAppointments();
   appointments.push(newAppointment);
   writeAppointments(appointments);

   return newAppointment;
}

//Update appointment status
export async function updateAppointmentStatus(id, status) {
   await fakeDelay(); // simulating a real network request

   const appointments = readAppointments().map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
   ); //If this appointment's id matches the id we're looking for, return an updated copy. Otherwise, return the appointment unchanged.
   writeAppointments(appointments);

   return appointments.find((appointment) => appointment.id === id);
   //immediately see the result of the update without needing to re-fetch everything.
}

export async function deleteAppointment(id) {
   await fakeDelay();
   const appointments = readAppointments().filter(
      (appointment) => appointment.id !== id,
   );
   writeAppointments(appointments);
}

// Updates an appointment's editable details (not just status).
export async function updateAppointment(id, updatedData) {
   await fakeDelay();
   const appointments = readAppointments().map((appointment) =>
      appointment.id === id ? { ...appointment, ...updatedData } : appointment,
   );
   writeAppointments(appointments);

   return appointments.find((appointment) => appointment.id === id);
}
