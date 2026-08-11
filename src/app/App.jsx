import Sidebar from "../components/layout/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import AppointmentsPage from "../pages/Appointments";
import DashboardPage from "../pages/Dashboard";
import MedicationsPage from "../pages/Medications";
import MentalHealthPage from "../pages/MentalHealth";
import MapPage from "../pages/Map";
import SupportPage from "../pages/Support";

export default function App() {
    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/mental-health" element={<MentalHealthPage />} />
                    <Route path="/service-map" element={<MapPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/medications" element={<MedicationsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                </Routes>
            </main>
        </div>
    );
}