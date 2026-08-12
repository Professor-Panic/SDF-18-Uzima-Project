import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ShowMap } from "./Map/App";
// import "./Map/index.css";

import AppointmentPage from "./Appointments/AppointmentsPage";
import "react-datepicker/dist/react-datepicker.css";
import "./Appointments/appointmentPageStyles.css";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      {/* <ShowMap /> */}
      <AppointmentPage />
   </StrictMode>,
);
