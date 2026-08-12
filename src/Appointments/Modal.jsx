// A reusable popup wrapper: dark overlay + centered card + close (X) button.
export default function Modal({ isOpen, onClose, children }) {
   if(!isOpen) return null;   

   return (
      <div className="modal-overlay" onClick={onClose}>
         {/* //clicking anywhere on this outer div calls onClose */}
         <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* //tells the browser -> this click happened, but don't let it bubble up to any parent elements. */}
            <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
            {children}
         </div>
      </div>
   );
}
