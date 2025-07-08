import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Propietarios from "./pages/propietarios";
import Contratos from "./pages/contratos";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="propietarios" element={<Propietarios />} />
          <Route path="contratos" element={<Contratos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);