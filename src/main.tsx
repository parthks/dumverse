import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import GameMap from "@/pages/GameMap"; // Import the Connect component
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/map" element={<GameMap />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
