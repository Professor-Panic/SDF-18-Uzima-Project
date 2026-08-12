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
         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>💊</span>
            <div>
               <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                  {medication.name}
               </p>
               <p style={{ margin: 0, fontSize: "12px", color: "#5C6E66" }}>
                  {medication.dosage} • {medication.quantityPerDose}
               </p>
            </div>
         </div>

         <input
            style={{ width: "20px", height: "20px", accentColor: "#187C4D" }}
            type="checkbox"
            checked={medication.taken} //controlled checkbox
            onChange={() => onToggleTaken(medication.id)}
         />
      </div>
   );
}
