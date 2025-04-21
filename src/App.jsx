import "./App.css";
import React from "react";
import Home from "./pages/Home";
import { Routes,Route } from "react-router-dom";
import Login from "./Login";

function App() {

  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>

  return (
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
      <Home />
    </div>
  );
}

export default App;
