import { LayoutDashboard, Brain, MapPin, Calendar, Pill, Plus, HeartHandshake, LogOut, HelpCircle } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Brain, label: "Mental Health" },
  { icon: MapPin, label: "Service Map" },
  { icon: Calendar, label: "Appointments" },
  { icon: Pill, label: "Medications" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Service Map"); // Default active like Figma

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between px-4 py-6">
      
      {/* Top: Logo */}
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-teal-500 rounded-lg p-2">
            <HeartHandshake size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight">Uzima</h1>
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight">Wellness</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Your Digital Sanctuary</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] transition-all
                ${active === label
                 ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
                }
              `}
            >
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div>
        <button className="flex items-center justify-center gap-2 w-full bg-teal-500 text-white py-3 rounded-xl font-semibold text-[14px] hover:bg-teal-600 transition mb-6 shadow-sm">
          <Plus size={18} /> New Check-In
        </button>

        <div className="space-y-1 px-2 text-gray-500 text-[14px]">
          <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-50 rounded-lg">
            <HelpCircle size={18} /> Support
          </button>
          <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-50 rounded-lg">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}