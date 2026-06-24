/**
 * App root — routing between Admin Dashboard (/admin) and Public Menu (/menu).
 * Dark mode state lives here and is passed to both pages.
 */
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import MenuPage from "./pages/MenuPage";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode((v) => !v);

  return (
    <Routes>
      {/* Default → admin dashboard */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={<AdminPage darkMode={darkMode} onToggleDark={toggleDark} />}
      />

      {/* Public menu */}
      <Route
        path="/menu"
        element={<MenuPage darkMode={darkMode} onToggleDark={toggleDark} />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
