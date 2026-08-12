// AppointmentPage.jsx
// Combines Appointments and Medications into one page, matching the
// "Schedule & Meds" mockup layout.

import { useEffect, useState } from "react";
import {
   getAppointments,
   addAppointment,
   updateAppointmentStatus,
} from "./appointmentsService";
import AppointmentCard from "./AppointmentCard";
import AddAppointmentForm from "./AddAppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import {
   getMedications,
   addMedication,
   toggleMedicationTaken,
} from "../Medication/medicationsService";
import MedicationRow from "../Medication/MedicationRow";
import AddMedicationForm from "../Medication/AddMedicationForm";
// import LowStockAlert from "../Medication/LowStockAlert";

const MOCK_USER_ID = "user_123";

function AppointmentPage() {
   const [appointments, setAppointments] = useState([]);
   const [medications, setMedications] = useState([]);
   const [loading, setLoading] = useState(true);

   // Controls whether the "Book Visit" / "Add Rx" forms are shown
   const [showAppointmentForm, setShowAppointmentForm] = useState(false);
   const [showMedicationForm, setShowMedicationForm] = useState(false);

   async function loadAll() {
      setLoading(true);
      const [apts, meds] = await Promise.all([
         getAppointments(MOCK_USER_ID),
         getMedications(MOCK_USER_ID),
      ]);
      setAppointments(apts);
      setMedications(meds);
      setLoading(false);
   }

   useEffect(() => {
      loadAll();
   }, []);

   async function handleAddAppointment(data) {
      await addAppointment(MOCK_USER_ID, data);
      setShowAppointmentForm(false);
      await loadAll();
   }

   async function handleUpdateAppointmentStatus(id, status) {
      await updateAppointmentStatus(id, status);
      await loadAll();
   }

   async function handleAddMedication(data) {
      await addMedication(MOCK_USER_ID, data);
      setShowMedicationForm(false);
      await loadAll();
   }

   async function handleToggleTaken(id) {
      await toggleMedicationTaken(id);
      await loadAll();
   }

   const morningMeds = medications.filter((m) => m.timeLabel === "Morning");
   const eveningMeds = medications.filter((m) => m.timeLabel === "Evening");

   if (loading) return <p>Loading your schedule…</p>;

   return (
      //Main div
      <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
         {/* Below the Navbar on the left*/}
         <div style={{ flex: 2 }}>
            <div
               style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <h3>Upcoming Appointments</h3>
               <button
                  onClick={() => setShowAppointmentForm(!showAppointmentForm)}
               >
                  + Book Visit
               </button>
            </div>

            <div>
               <AppointmentCalendar />
            </div>

            {showAppointmentForm && (
               <AddAppointmentForm onAdd={handleAddAppointment} />
            )}

            <div>
               {/* Appointment List */}
               {appointments.length === 0 ? (
                  <p>No appointments yet.</p>
               ) : (
                  appointments.map((appointment) => (
                     <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onUpdateStatus={handleUpdateAppointmentStatus}
                     />
                  ))
               )}
            </div>
         </div>

         {/* Below the Navbar on the right*/}
         <div style={{ flex: 1 }}>
            <div
               style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <h3>Today's Meds</h3>
               <button
                  onClick={() => setShowMedicationForm(!showMedicationForm)}
               >
                  + Add Rx
               </button>
            </div>

            {showMedicationForm && (
               <AddMedicationForm onAdd={handleAddMedication} />
            )}

            {/* Morning */}
            <div>
               <h4>Morning</h4>
               {morningMeds.length === 0 ? (
                  <p>Nothing scheduled.</p>
               ) : (
                  morningMeds.map((med) => (
                     <MedicationRow
                        key={med.id}
                        medication={med}
                        onToggleTaken={handleToggleTaken}
                     />
                  ))
               )}
            </div>

            {/* Evening */}
            <div>
               <h4>Evening</h4>
               {eveningMeds.length === 0 ? (
                  <p>Nothing scheduled.</p>
               ) : (
                  eveningMeds.map((med) => (
                     <MedicationRow
                        key={med.id}
                        medication={med}
                        onToggleTaken={handleToggleTaken}
                     />
                  ))
               )}
            </div>

            {/* Notification that meds are running low */}
            {/* <LowStockAlert
               medications={medications}
               onRequestRefill={(id) => alert(`Refill requested for ${id}`)}
            /> */}
         </div>
      </div>
   );
}

export default AppointmentPage;
