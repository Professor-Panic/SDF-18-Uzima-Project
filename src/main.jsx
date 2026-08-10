import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShowMap } from "./Map/App";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ShowMap />
    </StrictMode>
);