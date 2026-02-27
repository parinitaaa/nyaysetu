import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold text-blue-600"
      >
        <FaBalanceScale />
        NyaySetu
      </Link>

      <div className="space-x-6 font-medium">
        <Link to="/predict" className="hover:text-blue-600 transition">
          Predict Case Outcome
        </Link>

        <Link to="/rights" className="hover:text-blue-600 transition">
          Explore Your Legal Rights
        </Link>

        <Link to="/chatbot" className="hover:text-blue-600 transition">
          AI Legal Assistant
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;