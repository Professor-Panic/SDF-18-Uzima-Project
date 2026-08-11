import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShowMap } from "./Map/App";
import "./index.css";
import Sidebar from "./Components/Layout/Sidebar";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <div className="flex h-screen bg-[#f7f9fc]">
      <Sidebar />
      <div className="flex-1">
        <ShowMap />
      </div>
    </div>
        
        
    </StrictMode>
);