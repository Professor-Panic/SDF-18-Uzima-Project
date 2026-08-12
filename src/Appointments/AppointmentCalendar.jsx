// Displays a month calendar grid. Lets the user navigate between months and select a specific date.

import { useState } from "react";

function formatMonthYear(date) {
   return date.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
   });
}

function getDaysInMonth(year, month) {
   // month is 0-indexed (0 = Jan, 11 = Dec), matching JS convention
   //month + 1 → 10 (this actually points to November, since we're still zero-indexed)
   //new Date(2023, 10, 0) → "day 0 of November" → rolls back to October 31st
   return new Date(year, month + 1, 0).getDate(); //pulls just the day-of-month number back out
}

function getFirstDayOfWeek(year, month) {
   // Returns 0-6 (Sunday-Saturday) for whatever day-of-week the 1st falls on.
   return new Date(year, month, 1).getDay();
}

//Building the actual array of grid cells
//representing every cell the calendar grid needs to render — blanks first, then the real day numbers.
function buildCalendarGrid(viewedMonth) {
   const year = viewedMonth.getFullYear();
   const month = viewedMonth.getMonth();

   const daysInMonth = getDaysInMonth(year, month);
   const firstDayOfWeek = getFirstDayOfWeek(year, month);

   //one flat array representing every square in the grid, in order, blanks included
   const cells = [];

   // Empty cells before day 1, so the grid lines up under the right weekday
   for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
   }

   // The actual day numbers, 1 through however many days this month has
   for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
   }

   return cells;
}

//Calendar component
export default function AppointmentCalendar() {
   const [viewedMonth, setViewedMonth] = useState(new Date()); //starts out as today's actual date (whatever day it is when the component first loads)
   const [selectedDate, setSelectedDate] = useState(null); //nothing is selected yet

   const cells = buildCalendarGrid(viewedMonth);

   //Navigate through the different months
   function goToPreviousMonth() {
      setViewedMonth(
         new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1),
      );
      setSelectedDate(null);
   }

   function goToNextMonth() {
      setViewedMonth(
         new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1),
      );
      setSelectedDate(null);
   }

   function handleDayClick(day) {
      if (day === null) return;
      setSelectedDate(day);
   }

   return (
      <div>
         <div
            style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
            }}
         >
            <button onClick={goToPreviousMonth}>
               <svg
                  width="16"
                  height="16"
                  // viewBox="0 0 24 24"
                  // fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
               >
                  <path d="M15 18l-6-6 6-6" />
               </svg>
            </button>
            <h3>{formatMonthYear(viewedMonth)}</h3>
            <button onClick={goToNextMonth}>
               <svg
                  width="16"
                  height="16"
                  // viewBox="0 0 24 24"
                  // fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
               >
                  <path d="M9 18l6-6-6-6" />
               </svg>
            </button>
         </div>

         {/* //Days of the week */}
         <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(7, 1fr)", //create 7 columns, each taking an equal fraction
               textAlign: "center",
               fontSize: "12px",
               color: "#5C6E66",
            }}
         >
            {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
               <div key={index}>{label}</div>
            ))}
         </div>

         {/* //Selecting a day */}
         <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(7, 1fr)",
               textAlign: "center",
               gap: "4px",
               marginTop: "6px",
            }}
         >
            {cells.map((day, index) => (
               <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  style={{
                     padding: "8px",
                     borderRadius: "50%",
                     cursor: day ? "pointer" : "default", //real day cells show a clickable-looking cursor on hover
                     backgroundColor:
                        day !== null && day === selectedDate
                           ? "#12386E"
                           : "transparent",
                     color:
                        day !== null && day === selectedDate
                           ? "#fff"
                           : "#023326",
                  }}
               >
                  {day}
               </div>
            ))}
         </div>
      </div>
   );
}
