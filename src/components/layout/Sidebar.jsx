import {
    Calendar,
    HeartHandshake,
    HelpCircle,
    LayoutDashboard,
    MapPin,
    MoonStar,
    Pill,
    Plus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: MoonStar, label: "Mental Health", to: "/mental-health" },
    { icon: MapPin, label: "Service Map", to: "/service-map" },
    { icon: Calendar, label: "Appointments", to: "/appointments" },
    { icon: Pill, label: "Medications", to: "/medications" },
];

export default function Sidebar() {
    return (
        <aside className="sidebar-shell">
            <div className="sidebar-shell__inner">
                <div>
                    <div className="brand-block">
                        <div className="brand-block__icon">
                            <HeartHandshake size={20} />
                        </div>

                        <div>
                            <h1>Uzima Wellness</h1>
                            <p>Your Digital Sanctuary</p>
                        </div>
                    </div>

                    <nav className="sidebar-nav" aria-label="Primary">
                        {menuItems.map(({ icon: Icon, label, to }) => (
                            <NavLink
                                key={label}
                                to={to}
                                className={({ isActive }) => `sidebar-nav__item${isActive ? " is-active" : ""}`}
                            >
                                <span className="sidebar-nav__icon">
                                    <Icon size={18} strokeWidth={2} />
                                </span>
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button className="sidebar-action" type="button">
                        <Plus size={18} />
                        New Check-In
                    </button>

                    <div className="sidebar-utility-links">
                        <NavLink to="/support" className="sidebar-utility-link">
                            <HelpCircle size={18} />
                            Support
                        </NavLink>
                        <button className="sidebar-utility-link" type="button">
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}