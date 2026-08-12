import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShowMap } from "./Map/App";
import "./index.css";

import ScheduleAndMedsPage from "./features/schedule/ScheduleAndMedsPage";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <ShowMap />
    <ScheduleAndMedsPage />;
   </StrictMode>,
);