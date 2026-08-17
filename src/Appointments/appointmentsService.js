// Handles all data operations for the Appointments feature.
let mockAppointments = [
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

// Simulates the time it takes to talk to a real database incase of bugs
const fakeDelay = (ms = 5) =>
   new Promise((resolve) => setTimeout(resolve, ms));

// Fetches all appointments belonging to a specific user, soonest first.
export async function getAppointments(userId) {
   await fakeDelay(); //simulating a real network request
   return mockAppointments
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

   mockAppointments.push(newAppointment);
   return newAppointment;
}

//Update appointment status
export async function updateAppointmentStatus(id, status) {
   await fakeDelay(); // simulating a real network request

   mockAppointments = mockAppointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
   ); //If this appointment's id matches the id we're looking for, return an updated copy. Otherwise, return the appointment unchanged.

   return mockAppointments.find((appointment) => appointment.id === id);
   //immediately see the result of the update without needing to re-fetch everything.
}

export async function deleteAppointment(id) {
   await fakeDelay();
   mockAppointments = mockAppointments.filter(
      (appointment) => appointment.id !== id,
   );
}