import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ShowMap } from "./Map/App";
// import "./Map/index.css";

import AppointmentPage from "./Appointments/AppointmentsPage";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      {/* <ShowMap /> */}
      <AppointmentPage />
   </StrictMode>,
);
