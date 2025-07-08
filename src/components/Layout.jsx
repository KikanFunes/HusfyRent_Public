import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex gap-4">
        <Link to="/propietarios" className="text-blue-600 font-semibold hover:underline">
          Propietarios
        </Link>
        <Link to="/contratos" className="text-blue-600 font-semibold hover:underline">
          Contratos
        </Link>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}