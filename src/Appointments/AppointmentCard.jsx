import AppointmentStatusBadge from "./AppointmentStatusBadge";

function formatDateTime(isoString) {
   const date = new Date(isoString);

   return date.toLocaleString(
      undefined, //default that adapts automatically
      {
         weekday: "short",
         month: "short",
         day: "numeric",
         hour: "numeric",
         minute: "2-digit",
      },
   );
}

function AppointmentCard({ appointment, onUpdateStatus }) {
   //Incase the appointment passes and status wasn't changed then we should prompt user so the status can be changed accurately
   const isPast = new Date(appointment.dateTime) < new Date();
   let confirmationPrompt = null;

   if (appointment.status === "upcoming" && isPast) {
      confirmationPrompt = (
         <div>
            <p>Did you make it to this one?</p>
            <button onClick={() => onUpdateStatus(appointment.id, "completed")}>
               Yes
            </button>
            <button onClick={() => onUpdateStatus(appointment.id, "missed")}>
               No
            </button>
         </div>
      );
   }

   return (
      <div>
         <h3>{appointment.clinicNameManual}</h3>
         <p>{appointment.reason}</p>
         <p>{formatDateTime(appointment.dateTime)}</p>
         <AppointmentStatusBadge status={appointment.status} />

         {confirmationPrompt}
      </div>
   );
}

export default AppointmentCard;
