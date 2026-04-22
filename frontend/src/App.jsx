import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastProvider } from "./context/ToastContext";
import Predict from "./pages/Predict";
import Chatbot from "./pages/Chatbot";
import RightsCategories from "./pages/RightsCategories";
import RightsByCategory from "./pages/RightsByCategory";
import RightDetail from "./pages/RightDetail";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/rights" element={<RightsCategories />} />
        <Route path="/rights/:category_slug" element={<RightsByCategory />} />
        <Route
          path="/rights/:category_slug/:right_slug"
          element={<RightDetail />}
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
