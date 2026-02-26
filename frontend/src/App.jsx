import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RightsList from "./pages/RightsList";
import RightDetail from "./pages/RightDetail";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<RightsList />} />
          <Route path="/category/:slug/:rightFile" element={<RightDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;