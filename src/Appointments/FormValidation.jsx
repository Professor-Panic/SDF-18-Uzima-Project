// Shared validation and edge-case handling for all forms in the app

//  Date/time edge cases
// True if two Date objects fall on the same calendar day, ignoring time.
export function isSameDay(a, b) {
   return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
   );
}

// Computes the minTime/maxTime pair react-datepicker needs to block picking a time that's already passed — but only when "today" is the selected day.
// Any other future day gets the full 24-hour range, since minTime/maxTime

export function getSelectableTimeRange(selectedDate, allowExactTime = null) {
   const activeDay = selectedDate ?? new Date();
   const now = new Date();
   const pickingToday = isSameDay(activeDay, now);

   let minTime = pickingToday
      ? now
      : new Date(
           activeDay.getFullYear(),
           activeDay.getMonth(),
           activeDay.getDate(),
           0,
           0,
        );

   // If the original time would otherwise get excluded, pull minTime back to cover it, so editing something else on the form doesn't force the time to change too.
   if (
      allowExactTime &&
      isSameDay(activeDay, allowExactTime) &&
      allowExactTime < minTime
   ) {
      minTime = allowExactTime;
   }

   const maxTime = new Date(
      activeDay.getFullYear(),
      activeDay.getMonth(),
      activeDay.getDate(),
      23,
      45,
   );

   return { minTime, maxTime };
}

//  Text field validation
// Rejects empty strings AND whitespace-only strings ("   " passes the browser's native `required` check but shouldn't count as real input).
export function validateRequiredText(value, fieldLabel) {
   if (!value || !value.trim()) {
      return `${fieldLabel} can't be empty.`;
   }
   return null; // null = valid
}

//  Numeric field validation for things like "quantity remaining" — must be a non-negative whole number.
export function validateQuantity(value, fieldLabel) {
   if (value === "" || value === null) return null; // optional fields can be blank
   const num = Number(value);
   if (Number.isNaN(num)) return `${fieldLabel} must be a number.`;
   if (num < 0) return `${fieldLabel} can't be negative.`;
   if (!Number.isInteger(num)) return `${fieldLabel} must be a whole number.`;
   return null;
}

// Submission safety
// Wraps an async submit handler so rapid double-clicks (or a slow network & impatient re-click) can't fire it twice concurrently.
export function createSubmitGuard() {
   let inFlight = false;
   return async function guard(fn) {
      if (inFlight) return;
      inFlight = true;
      try {
         await fn();
      } finally {
         inFlight = false;
      }
   };
}

//  Error messages
// Turns a caught error into something safe and readable to show the user, instead of a raw error object or a silent console.error with nothing shown on screen.
export function toUserMessage(
   error,
   fallback = "Something went wrong. Please try again.",
) {
   if (!navigator.onLine)
      return "You're offline — check your connection and try again.";
   if (error?.message) return error.message;
   return fallback;
}
