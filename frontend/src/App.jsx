import { BrowserRouter, Routes, Route } from "react-router-dom";
import Predict from "./pages/Predict";
import Chatbot from "./pages/Chatbot";
import RightsCategories from "./pages/RightsCategories";
import RightsByCategory from "./pages/RightsByCategory";
import RightDetail from "./pages/RightDetail";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <Routes>
         <Route path="/" element={<Landing />} />
<Route path="/predict" element={<Predict />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/rights" element={<RightsCategories />} />
          <Route path="/rights/:category_slug" element={<RightsByCategory />} />
          <Route path="/rights/:category_slug/:right_slug" element={<RightDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;