import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppointmentPage from "./Appointments/AppointmentsPage";
import Header from "./Dashboard/Dashboard"
import { ShowMap } from "./Map/Map";
import {Sidebar} from "./Components/Sidebar"
createRoot(document.getElementById("root")).render(
   <StrictMode>
      <BrowserRouter>
      <Routes>
         
         <Route path="/dashboard" element={<Header/>}/>
         <Route path="/appointments" element={<AppointmentPage/>}/>
         <Route path="/map" element={<ShowMap/>}/>
         <Route path="/sidebar" element={<Sidebar/>}/>
      </Routes>
      </BrowserRouter>
   </StrictMode>,
);