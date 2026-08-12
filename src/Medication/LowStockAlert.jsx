export default function LowStockAlert({ medications, onRequestRefill }) {
   const lowStockMeds = medications.filter(
      (med) => med.quantityRemaining <= med.lowStockThreshold,
   );
   if (lowStockMeds.length === 0) return null;

   return (
      <div className="low-stock-alert">
         {lowStockMeds.map((med) => (
            <div key={med.id} className="low-stock-alert__row">
               <span>
                  {med.name} running low — {med.quantityRemaining} doses
                  remaining
               </span>
               <button onClick={() => onRequestRefill(med.id)}>
                  Request Refill
               </button>
            </div>
         ))}
      </div>
   );
}
