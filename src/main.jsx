import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import AppointmentPage from "./Appointments/AppointmentsPage";
import Header from "./Dashboard/Dashboard";
import MentalHealthPage from "./Chatbot/MentalHealth";
import Sidebar from "./Sidebar/Sidebar";
import { ShowMap } from "./Map/Map";

import "react-datepicker/dist/react-datepicker.css";
import "./Appointments/appointmentPageStyles.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div className="app-shell">
        {/* Sidebar stays visible on every page */}
        <Sidebar />

        {/* Only this section changes when navigating */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/dashboard" element={<Header />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/map" element={<ShowMap />} />
            <Route
              path="/mental-health"
              element={<MentalHealthPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </StrictMode>
);