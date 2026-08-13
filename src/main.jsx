import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppointmentPage from "./Appointments/AppointmentsPage";
import Header from "./Dashboard/Dashboard"
import { ShowMap } from "./Map/Map";
createRoot(document.getElementById("root")).render(
   <StrictMode>
      <BrowserRouter>
      <Routes>
         
         <Route path="/dashboard" element={<Header/>}/>
         <Route path="/appointments" element={<AppointmentPage/>}/>
         <Route path="/map" element={<ShowMap/>}/>
         
      </Routes>
      </BrowserRouter>
   </StrictMode>,
);