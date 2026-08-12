import { useEffect, useState } from "react";
import {
   getAppointments,
   addAppointment,
   updateAppointmentStatus,
} from "../appointments/appointmentsService";
import AppointmentCard from "../appointments/AppointmentCard";
import AddAppointmentForm from "../appointments/AddAppointmentForm";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import {
   getMedications,
   addMedication,
   toggleMedicationTaken,
} from "../medications/medicationsService";
import MedicationRow from "../medications/MedicationRow";
import AddMedicationForm from "../medications/AddMedicationForm";
// import LowStockAlert from "../medications/LowStockAlert";

const MOCK_USER_ID = "user_123";

export default function ScheduleAndMedsPage() {
   const [appointments, setAppointments] = useState([]);
   const [medications, setMedications] = useState([]);
   const [loading, setLoading] = useState(true);

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
      await loadAll();
   }
   async function handleUpdateAppointmentStatus(id, status) {
      await updateAppointmentStatus(id, status);
      await loadAll();
   }
   async function handleAddMedication(data) {
      await addMedication(MOCK_USER_ID, data);
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
      <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
         <div style={{ flex: 2 }}>
            <h2>Upcoming Appointments</h2>
            <AppointmentCalendar />
            <AddAppointmentForm onAdd={handleAddAppointment} />
            {appointments.map((a) => (
               <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onUpdateStatus={handleUpdateAppointmentStatus}
               />
            ))}
         </div>
         <div style={{ flex: 1 }}>
            <h2>Today's Meds</h2>
            <AddMedicationForm onAdd={handleAddMedication} />
            <h4>Morning</h4>
            {morningMeds.map((m) => (
               <MedicationRow
                  key={m.id}
                  medication={m}
                  onToggleTaken={handleToggleTaken}
               />
            ))}
            <h4>Evening</h4>
            {eveningMeds.map((m) => (
               <MedicationRow
                  key={m.id}
                  medication={m}
                  onToggleTaken={handleToggleTaken}
               />
            ))}
            {/* <LowStockAlert
               medications={medications}
               onRequestRefill={(id) => alert(`Refill requested for ${id}`)}
            /> */}
         </div>
      </div>
   );
}
