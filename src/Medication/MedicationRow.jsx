import { Pill } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function PillIcon({ color = "#0f7a33" }) {
   return (
      <span className="med-row__icon" style={{ "--pill-color": color }}>
         <Pill size={16} color={color} strokeWidth={2.2} />
      </span>
   );
}

// Displays a single medication with a checkbox to mark it taken/untaken.

export default function MedicationRow({
   medication,
   onToggleTaken,
   onDelete,
   onEdit,
}) {
   const [menuOpen, setMenuOpen] = useState(false);
   const [confirmingDelete, setConfirmingDelete] = useState(false);
   // Tracks the delete request actually in flight, so a slow network/a second click on "Delete" can't fire onDelete twice for the same row.
   const [deleting, setDeleting] = useState(false);
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

   async function handleConfirmDelete() {
      if (deleting) return; // already in flight — ignore extra clicks
      setDeleting(true);
      try {
         await onDelete(medication.id);
         // no need to reset `deleting` on success if its about to unmount
      } catch (error) {
         console.error("Failed to delete medication:", error);
         setDeleting(false); // let them retry if it actually failed
      }
   }

   return (
      <div>
         <div className="med-row">
            <PillIcon color="#0f7a33" />
            <div>
               <p className="med-row__name">{medication.name}</p>
               <p className="med-row__meta">
                  {medication.dosage} • {medication.quantityPerDose}
               </p>
            </div>

            <div className="med-row-actions">
               <input
                  className="med-row__checkbox"
                  type="checkbox"
                  checked={medication.taken}
                  onChange={() => onToggleTaken(medication.id)}
                  aria-label={`Mark ${medication.name} as taken`}
               />

               <div className="med-row-menu" ref={menuRef}>
                  <button
                     className="appointment-kebab"
                     aria-label="Medication options"
                     aria-expanded={menuOpen}
                     onClick={() => setMenuOpen((open) => !open)}
                  >
                     ⋮
                  </button>

                  {menuOpen && (
                     <div className="appointment-dropdown" role="menu">
                        <button
                           role="menuitem"
                           className="appointment-dropdown-item"
                           onClick={() => {
                              setMenuOpen(false);
                              onEdit(medication);
                           }}
                        >
                           Edit medication
                        </button>

                        <button
                           role="menuitem"
                           className="appointment-dropdown-item appointment-dropdown-item--danger"
                           onClick={() => {
                              setMenuOpen(false);
                              setConfirmingDelete(true);
                           }}
                        >
                           Delete medication
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {confirmingDelete && (
            <div className="appointment-delete-confirm">
               <p>Delete this medication? This can't be undone.</p>
               <div className="appointment-confirm-actions">
                  <button
                     className="appointment-delete-confirm-btn"
                     onClick={handleConfirmDelete}
                     disabled={deleting}
                  >
                     {deleting ? "Deleting..." : "Delete"}
                  </button>
                  <button
                     onClick={() => setConfirmingDelete(false)}
                     disabled={deleting}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
