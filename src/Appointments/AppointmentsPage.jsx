// Combines Appointments and Medications into one page

import { useEffect, useState } from "react";
import {
   getAppointments,
   addAppointment,
   updateAppointmentStatus,
   deleteAppointment,
} from "./appointmentsService";
import AppointmentCard from "./AppointmentCard";
import AddAppointmentForm from "./AddAppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import {
   getMedications,
   addMedication,
   toggleMedicationTaken,
   deleteMedication,
} from "../Medication/medicationsService";
import MedicationRow from "../Medication/MedicationRow";
import AddMedicationForm from "../Medication/AddMedicationForm";
import LowStockAlert from "../Medication/LowStockAlert";

import Modal from "./Modal";

const MOCK_USER_ID = "user_123";

function AppointmentPage() {
   const [appointments, setAppointments] = useState([]);
   const [medications, setMedications] = useState([]);
   const [loading, setLoading] = useState(true);
   const [initialLoadDone, setInitialLoadDone] = useState(false);
   const [toggleError, setToggleError] = useState(null);

   // Controls whether the "Book Visit" / "Add Rx" forms are shown
   const [showAppointmentForm, setShowAppointmentForm] = useState(false);
   const [showMedicationForm, setShowMedicationForm] = useState(false);

   // Holds the date clicked on the calendar, so the modal can open pre-filled.
   // Stays null when the modal was opened via "+ Book Visit" instead.
   const [prefilledDate, setPrefilledDate] = useState(null);

   async function loadAll() {
      if (!initialLoadDone) setLoading(true);
      const [apts, meds] = await Promise.all([
         getAppointments(MOCK_USER_ID),
         getMedications(MOCK_USER_ID),
      ]);
      setAppointments(apts);
      setMedications(meds);
      setLoading(false);
      setInitialLoadDone(true);
   }

   useEffect(() => {
      loadAll();
   }, []);

   // "+ Book Visit" opens empty; clicking a calendar day opens with that date set
   function openAppointmentForm(date = null) {
      setPrefilledDate(date);
      setShowAppointmentForm(true);
   }

   function closeAppointmentForm() {
      setShowAppointmentForm(false);
      setPrefilledDate(null);
   }

   async function handleAddAppointment(data) {
      await addAppointment(MOCK_USER_ID, data);
      closeAppointmentForm();
      // await loadAll();
   }

   async function handleUpdateAppointmentStatus(id, status) {
      await updateAppointmentStatus(id, status);
      // await loadAll();
   }

   async function handleDeleteAppointment(id) {
      await deleteAppointment(id);
      // await loadAll();
   }

   async function handleAddMedication(data) {
      await addMedication(MOCK_USER_ID, data);
      setShowMedicationForm(false);
      // await loadAll();
   }

   async function handleDeleteMedication(id) {
      await deleteMedication(id);
      // await loadAll();
   }

   async function handleToggleTaken(id) {
      setMedications((prev) =>
         prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)),
      );

      try {
         await toggleMedicationTaken(id);
         setToggleError(null);
      } catch (error) {
         console.error("Failed to toggle medication:", error);
         setMedications((prev) =>
            prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)),
         );
         setToggleError("Couldn't save that change. Try again.");
      }
   }

   const morningMeds = medications.filter((m) => m.timeLabel === "Morning");
   const eveningMeds = medications.filter((m) => m.timeLabel === "Evening");

   if (loading) return <p>Loading your schedule…</p>;

   return (
      //Main div
      <div className="appointment-page">
         {/* Below the Navbar on the left*/}
         <div className="appointment-column">
            <div className="appointment-column__header">
               <h3>Upcoming Appointments</h3>
               <button
                  className="appointment-btn appointment-btn--primary"
                  // onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                  onClick={() => openAppointmentForm()}
               >
                  + Book Visit
               </button>
            </div>

            <div className="calendar-card">
               <AppointmentCalendar onDateSelect={openAppointmentForm} />
            </div>

            {/* //Make the form pop up */}
            <Modal
               isOpen={showAppointmentForm}
               // onClose={() => setShowAppointmentForm(false)}
               onClose={closeAppointmentForm}
            >
               <AddAppointmentForm
                  onAdd={handleAddAppointment}
                  initialDateTime={prefilledDate}
               />
            </Modal>

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
                        onDelete={handleDeleteAppointment}
                     />
                  ))
               )}
            </div>
         </div>

         {/* Below the Navbar on the right*/}
         <div className="appointment-column">
            <div className="appointment-column__header">
               <h3>Today's Meds</h3>
               <button
                  className="appointment-btn appointment-btn--outline"
                  onClick={() => setShowMedicationForm(!showMedicationForm)}
               >
                  + Add Rx
               </button>
            </div>

            {/* //Make the form pop up */}
            <Modal
               isOpen={showMedicationForm}
               onClose={() => setShowMedicationForm(false)}
            >
               <AddMedicationForm onAdd={handleAddMedication} />
            </Modal>

            {/* Morning */}
            <div className="meds-card">
               <h4>Morning</h4>
               {morningMeds.length === 0 ? (
                  <p>Nothing scheduled.</p>
               ) : (
                  morningMeds.map((med) => (
                     <MedicationRow
                        key={med.id}
                        medication={med}
                        onToggleTaken={handleToggleTaken}
                        onDelete={handleDeleteMedication}
                     />
                  ))
               )}
            </div>

            {/* Evening */}
            <div className="meds-card">
               <h4>Evening</h4>
               {eveningMeds.length === 0 ? (
                  <p>Nothing scheduled.</p>
               ) : (
                  eveningMeds.map((med) => (
                     <MedicationRow
                        key={med.id}
                        medication={med}
                        onToggleTaken={handleToggleTaken}
                        onDelete={handleDeleteMedication}
                     />
                  ))
               )}
            </div>

            {toggleError && <p className="error-text">{toggleError}</p>}

            {/* Notification that meds are running low */}
            <LowStockAlert
               medications={medications}
               onRequestRefill={(id) => alert(`Refill requested for ${id}`)}
            />
         </div>
      </div>
   );
}

export default AppointmentPage;
