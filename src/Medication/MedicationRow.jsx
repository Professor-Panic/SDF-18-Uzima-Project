// Displays a single medication with a checkbox to mark it taken/untaken.

export default function MedicationRow({ medication, onToggleTaken }) {
   return (
      <div
         style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #cde0f8",
         }}
      >
         <div className="med-row">
            <span >💊</span>
            <div>
               <p className="med-row__name">
                  {medication.name}
               </p>
               <p className="med-row__meta">
                  {medication.dosage} • {medication.quantityPerDose}
               </p>
            </div>
         </div>

         <input
            className="med-row__checkbox"
            type="checkbox"
            checked={medication.taken} //controlled checkbox
            onChange={() => onToggleTaken(medication.id)}
         />
      </div>
   );
}
