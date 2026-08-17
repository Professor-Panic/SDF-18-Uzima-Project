import { useEffect, useRef } from "react";

// A reusable popup wrapper
export default function Modal({ isOpen, onClose, children }) {
   const closeButtonRef = useRef(null);

   // Close on Escape, and move focus into the modal when it opens
   useEffect(() => {
      if (!isOpen) return;

      function handleKeyDown(e) {
         if (e.key === "Escape") onClose();
      }
      document.addEventListener("keydown", handleKeyDown);

      // small delay so the element actually exists in the DOM before focusing
      const focusTimeout = setTimeout(() => closeButtonRef.current?.focus(), 0);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         clearTimeout(focusTimeout);
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   return (
      <div className="modal-overlay" onClick={onClose}>
         {/* //clicking anywhere on this outer div calls onClose */}
         <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* //tells the browser -> this click happened, but don't let it bubble up to any parent elements. */}
            <button
               ref={closeButtonRef}
               className="modal-close"
               onClick={onClose}
               aria-label="Close"
            >
               ×
            </button>
            {children}
         </div>
      </div>
   );
}
