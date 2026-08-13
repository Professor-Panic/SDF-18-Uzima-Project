// import AppointmentStatusBadge from "./AppointmentStatusBadge";

import { useEffect, useRef, useState } from "react";

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

// onEdit: called with the full appointment object when "Edit" is clicked,
// so the parent can open the form pre-filled with this appointment's data.
function AppointmentCard({ appointment, onUpdateStatus, onDelete, onEdit }) {
   //Incase the appointment passes and status wasn't changed then we should prompt user so the status can be changed accurately
   const isPast = new Date(appointment.dateTime) < new Date();
   let confirmationPrompt = null;

   const [menuOpen, setMenuOpen] = useState(false);
   const [confirmingDelete, setConfirmingDelete] = useState(false);
   const menuRef = useRef(null);

   // close the kebab menu if the user clicks anywhere outside of it
   useEffect(() => {
      function handleClickOutside(e) {
         if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuOpen(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   if (appointment.status === "upcoming" && isPast) {
      confirmationPrompt = (
         <div>
            <p>Did you make it to this appointment?</p>
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
      <div className="appointment-card">
         <div className="appointment-card-menu" ref={menuRef}>
            <button
               className="appointment-kebab"
               aria-label="Appointment options"
               aria-expanded={menuOpen}
               onClick={() => setMenuOpen((open) => !open)}
            >
               ⋮
            </button>

            {menuOpen && (
               <div className="appointment-dropdown" role="menu">
                  {/* Edit option — sits above Delete since it's the safer,
                      more commonly used action */}
                  <button
                     role="menuitem"
                     className="appointment-dropdown-item"
                     onClick={() => {
                        setMenuOpen(false);
                        onEdit(appointment);
                     }}
                  >
                     Edit appointment
                  </button>
                  <button
                     role="menuitem"
                     className="appointment-dropdown-item appointment-dropdown-item--danger"
                     onClick={() => {
                        setMenuOpen(false);
                        setConfirmingDelete(true);
                     }}
                  >
                     Delete appointment
                  </button>
               </div>
            )}
         </div>

         <div>
            <h3>{appointment.clinicNameManual}</h3>
            <div className="appointment-card-body">
               <div className="appointment-card-left">
                  <p className="appointment-reason">{appointment.reason}</p>
                  <span
                     className={`appointment-status appointment-status--${appointment.status}`}
                  >
                     {appointment.status}
                  </span>
               </div>
               <div className="appointment-card-right">
                  <p className="appointment-datetime">
                     {formatDateTime(appointment.dateTime)}
                  </p>
               </div>
            </div>
         </div>

         {confirmationPrompt}

         {confirmingDelete && (
            <div className="appointment-delete-confirm">
               <p>Delete this appointment? This can't be undone.</p>
               <div className="appointment-confirm-actions">
                  <button
                     className="appointment-delete-confirm-btn"
                     onClick={() => {
                        onDelete(appointment.id);
                        setConfirmingDelete(false);
                     }}
                  >
                     Delete
                  </button>
                  <button onClick={() => setConfirmingDelete(false)}>
                     Cancel
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default AppointmentCard;
