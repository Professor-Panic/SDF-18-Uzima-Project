// Combines Appointments and Medications into one page

import { useEffect, useState } from "react";
import {
   getAppointments,
   addAppointment,
   updateAppointment,
   updateAppointmentStatus,
   deleteAppointment,
} from "./appointmentsService";
import AppointmentCard from "./AppointmentCard";
import AddAppointmentForm from "./AddAppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import { syncAllToGoogleCalendar } from "./googleCalendar";
import {
   getMedications,
   addMedication,
   updateMedication,
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
   const [editingAppointment, setEditingAppointment] = useState(null);
   const [medications, setMedications] = useState([]);
   const [editingMedication, setEditingMedication] = useState(null);
   const [loading, setLoading] = useState(true);
   const [initialLoadDone, setInitialLoadDone] = useState(false);
   const [toggleError, setToggleError] = useState(null);

   // Controls whether the "Book Visit" / "Add Rx" forms are shown
   const [showAppointmentForm, setShowAppointmentForm] = useState(false);
   const [showMedicationForm, setShowMedicationForm] = useState(false);

   // Holds { date, matches } when a calendar day WITH existing appointments is clicked — powers the "edit or add new" choice popup.
   const [dateChoice, setDateChoice] = useState(null);

   const appointmentDates = appointments.map((a) => new Date(a.dateTime));

   // Holds the date clicked on the calendar, so the modal can open pre-filled.
   // Stays null when the modal was opened via "+ Book Visit" instead.
   const [prefilledDate, setPrefilledDate] = useState(null);

   async function loadAll() {
      // only show the full "Loading your schedule…" state on the very first
      // load — subsequent refreshes (after add/edit/delete) shouldn't blank the page
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

   // Same "ignore time, compare just the day" logic as the calendar's own dot check.
   function findAppointmentsOnDate(date) {
      return appointments.filter((a) => {
         const d = new Date(a.dateTime);
         return (
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate()
         );
      });
   }

   // Called when a calendar day is clicked. If that day already has appointments, show the choice popup instead of jumping straight to "add".
   function handleCalendarDateClick(date) {
      const matches = findAppointmentsOnDate(date);
      if (matches.length > 0) {
         setDateChoice({ date, matches });
      } else {
         openAppointmentForm(date);
      }
   }

   function closeDateChoice() {
      setDateChoice(null);
   }

   // "+ Book Visit" opens empty; clicking a calendar day opens with that date set
   function openAppointmentForm(date = null) {
      setPrefilledDate(date);
      setShowAppointmentForm(true);
   }

   function openEditAppointment(appointment) {
      setEditingAppointment(appointment);
      setShowAppointmentForm(true);
   }

   function closeAppointmentForm() {
      setShowAppointmentForm(false);
      setPrefilledDate(null);
      setEditingAppointment(null);
   }

   function openEditMedication(medication) {
      setEditingMedication(medication);
      setShowMedicationForm(true);
   }

   function closeMedicationForm() {
      setShowMedicationForm(false);
      setEditingMedication(null);
   }

   async function handleAddAppointment(data) {
      await addAppointment(MOCK_USER_ID, data);
      closeAppointmentForm();
      await loadAll();
   }

   async function handleUpdateAppointment(id, data) {
      await updateAppointment(id, data);
      closeAppointmentForm();
      await loadAll();
   }

   async function handleUpdateAppointmentStatus(id, status) {
      await updateAppointmentStatus(id, status);
      await loadAll();
   }

   async function handleDeleteAppointment(id) {
      await deleteAppointment(id);
      await loadAll();
   }

   async function handleAddMedication(data) {
      await addMedication(MOCK_USER_ID, data);
      closeMedicationForm();
      await loadAll();
   }

   async function handleUpdateMedication(id, data) {
      await updateMedication(id, data);
      closeMedicationForm();
      await loadAll();
   }

   async function handleDeleteMedication(id) {
      await deleteMedication(id);
      await loadAll();
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
               <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                     className="appointment-btn appointment-btn--outline"
                     // onClick={() => syncAllToGoogleCalendar(appointments)}
                     // disabled={appointments.length === 0}
                  >
                     Sync to Calendar
                  </button>
                  <button
                     className="appointment-btn appointment-btn--primary"
                     onClick={() => openAppointmentForm()}
                  >
                     + Book Visit
                  </button>
               </div>
            </div>

            <div className="calendar-card">
               <AppointmentCalendar
                  onDateSelect={handleCalendarDateClick}
                  appointmentDates={appointmentDates}
               />
            </div>

            {/* Choice popup — only appears when the clicked date already has appointments */}
            <Modal isOpen={Boolean(dateChoice)} onClose={closeDateChoice}>
               {dateChoice && (
                  <div className="styled-form">
                     <h3>
                        {dateChoice.date.toLocaleDateString(undefined, {
                           month: "long",
                           day: "numeric",
                           year: "numeric",
                        })}
                     </h3>
                     <p
                        style={{
                           color: "#5d6e68",
                           fontSize: "0.85rem",
                           marginBottom: "1rem",
                        }}
                     >
                        You already have{" "}
                        {dateChoice.matches.length === 1
                           ? "an appointment"
                           : "appointments"}{" "}
                        on this day.
                     </p>

                     {dateChoice.matches.map((appointment) => (
                        <div key={appointment.id} className="date-choice-row">
                           <div>
                              <p className="date-choice-row__title">
                                 {appointment.clinicNameManual}
                              </p>
                              <p className="date-choice-row__meta">
                                 {appointment.reason}
                              </p>
                           </div>
                           <button
                              className="appointment-btn appointment-btn--outline"
                              onClick={() => {
                                 closeDateChoice();
                                 openEditAppointment(appointment);
                              }}
                           >
                              Edit
                           </button>
                        </div>
                     ))}

                     <button
                        className="appointment-btn appointment-btn--primary"
                        style={{
                           width: "100%",
                           justifyContent: "center",
                           marginTop: "1rem",
                        }}
                        onClick={() => {
                           const clickedDate = dateChoice.date;
                           closeDateChoice();
                           openAppointmentForm(clickedDate);
                        }}
                     >
                        + Add new appointment
                     </button>
                  </div>
               )}
            </Modal>

            {/* //Make the form pop up */}
            <Modal isOpen={showAppointmentForm} onClose={closeAppointmentForm}>
               <AddAppointmentForm
                  onAdd={handleAddAppointment}
                  onUpdate={handleUpdateAppointment}
                  editingAppointment={editingAppointment}
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
                        onEdit={openEditAppointment}
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
                  onClick={() => setShowMedicationForm(true)}
               >
                  + Add Rx
               </button>
            </div>

            {/* //Make the form pop up */}
            <Modal isOpen={showMedicationForm} onClose={closeMedicationForm}>
               <AddMedicationForm
                  onAdd={handleAddMedication}
                  onUpdate={handleUpdateMedication}
                  editingMedication={editingMedication}
               />
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
                        onEdit={openEditMedication}
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
                        onEdit={openEditMedication}
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
