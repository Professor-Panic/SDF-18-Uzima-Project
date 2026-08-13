import {
  LayoutDashboard,
  Brain,
  MapPin,
  Calendar,
  Pill,
  Plus,
  HeartHandshake,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { useState } from "react";

import "./appointmentPageStyles.css";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    icon: Brain,
    label: "Mental Health",
  },
  {
    icon: MapPin,
    label: "Service Map",
  },
  {
    icon: Calendar,
    label: "Appointments",
  },
  {
    icon: Pill,
    label: "Medications",
  },
];

export default function Sidebar() {
  const [active, setActive] = useState("Service Map");

  return (
    <aside className="sidebar">

      {/* ================= BRAND ================= */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <HeartHandshake size={20} />
        </div>

        <div className="sidebar-brand-text">
          <h1>Uzima</h1>
          <h2>Digital Sanctuary</h2>
          <p>Your Digital Wellness Companion</p>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="sidebar-menu">

        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`sidebar-menu-item ${
              active === label ? "sidebar-menu-item--active" : ""
            }`}
          >
            <Icon size={20} strokeWidth={1.75} />

            <span>{label}</span>
          </button>
        ))}

      </nav>

      {/* ================= BOTTOM ================= */}
      <div className="sidebar-bottom">

        {/* New Check-In */}
        <button className="sidebar-checkin">
          <Plus size={18} strokeWidth={2} />
          <span>New Check-In</span>
        </button>

        {/* Support and Logout */}
        <div className="sidebar-bottom-menu">

          <button className="sidebar-bottom-item">
            <HelpCircle size={18} strokeWidth={1.8} />
            <span>Support</span>
          </button>

          <button className="sidebar-bottom-item sidebar-logout">
            <LogOut size={18} strokeWidth={1.8} />
            <span>Log Out</span>
          </button>

        </div>

      </div>
    </aside>
  );
}