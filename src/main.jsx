/**
 * main.jsx
 *
 * This is the app entry point. It mounts the router and wraps all page content in
 * the custom AppUiShell so the entire project uses the new navbar, sidebar,
 * background styling, and layout spacing.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import AppointmentPage from "./Appointments/AppointmentsPage";
import Header from "./Dashboard/Dashboard";
import MentalHealthPage from "./Chatbot/MentalHealth";
import { ShowMap } from "./Map/Map";
import { AppUiShell } from "./user-inreface/AppUiShell";

import "react-datepicker/dist/react-datepicker.css";
import "./Appointments/appointmentPageStyles.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppUiShell>
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
      </AppUiShell>
    </BrowserRouter>
  </StrictMode>
);