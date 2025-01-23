// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChatAdmin from "./components/ChatAdmin";

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat-admin" element={<ChatAdmin />} />
            <Route path="/DaftarPenyakit" element={<DaftarPenyakit />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
