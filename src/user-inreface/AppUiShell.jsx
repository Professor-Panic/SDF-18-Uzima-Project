/**
 * AppUiShell
 *
 * This component wraps the entire app with the custom glassmorphism layout:
 * - sticky translucent navbar
 * - hover-enabled left sidebar
 * - settings modal for the sidebar toggle
 * - responsive spacing so the content remains clear and readable across screen sizes
 */
import { useEffect, useState } from "react";
import { Calendar, LayoutDashboard, MapPin, Menu, MoonStar, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router";
import SettingsPanel from "./SettingsPanel";
import "./ui-shell.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: MoonStar, label: "Mental Health", to: "/mental-health" },
  { icon: MapPin, label: "Service Map", to: "/map" },
  { icon: Calendar, label: "Appointments", to: "/appointments" },
];

export function AppUiShell({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sidebarHovering, setSidebarHovering] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hoverEnabled || window.innerWidth <= 760) {
      setHovered(false);
      setSidebarHovering(false);
      return undefined;
    }

    const handlePointerMove = (event) => {
      const isLeftEdgeHover = event.clientX <= 18;
      setHovered(isLeftEdgeHover || sidebarHovering);
    };

    const handlePointerLeave = () => {
      setHovered(false);
      setSidebarHovering(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [hoverEnabled, sidebarHovering]);

  const sidebarVisible = sidebarOpen || hovered || sidebarHovering;

  return (
    <div className="ui-shell">
      <header className={`ui-navbar ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="ui-navbar__brand">
          <div className="ui-brand-mark">
            <Sparkles size={16} />
          </div>
          <span>Uzima Wellness</span>
        </div>

        <nav className="ui-navbar__nav" aria-label="Main navigation">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => `ui-nav-link ${isActive ? "is-active" : ""}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ui-navbar__actions">
          <button
            type="button"
            className="ui-action ui-action--ghost"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="ui-action ui-action--primary"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
          >
            <Menu size={17} />
            <span>Menu</span>
          </button>
        </div>
      </header>

      <aside
        className={`ui-sidebar ${sidebarVisible ? "is-open" : "is-collapsed"}`}
        onMouseEnter={() => {
          setSidebarHovering(true);
          setHovered(true);
        }}
        onMouseLeave={() => {
          setSidebarHovering(false);
          setHovered(false);
        }}
      >
        <div className="ui-sidebar__inner">
          <div className="ui-sidebar__header">
            <div className="ui-sidebar__avatar">U</div>
            <div>
              <p className="ui-sidebar__eyebrow">Care portal</p>
              <h2>Uzima</h2>
            </div>
          </div>

          <nav className="ui-sidebar__nav" aria-label="Sidebar navigation">
            {navItems.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => `ui-sidebar__item ${isActive ? "is-active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="ui-sidebar__icon">
                  <Icon size={17} />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <button type="button" className="ui-sidebar__cta">
            <span className="ui-sidebar__cta-line" />
            New Check-In
          </button>
        </div>
      </aside>

      <main className={`ui-main ${sidebarVisible ? "ui-main--shifted" : ""}`}>{children}</main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        hoverEnabled={hoverEnabled}
        onToggleHover={() => setHoverEnabled((current) => !current)}
      />
    </div>
  );
}
