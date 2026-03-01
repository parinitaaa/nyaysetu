import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12 md:mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg md:text-xl font-bold text-indigo-600 mb-3 md:mb-4"
            >
              <FaBalanceScale />
              NyaySetu
            </Link>
            <p className="text-gray-600 text-sm">
              Empowering citizens with instant legal guidance and case outcome predictions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/predict" className="text-gray-600 hover:text-indigo-600 text-sm transition block py-1">
                  Predict Case Outcome
                </Link>
              </li>
              <li>
                <Link to="/rights" className="text-gray-600 hover:text-indigo-600 text-sm transition block py-1">
                  Explore Your Rights
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-600 hover:text-indigo-600 text-sm transition block py-1">
                  AI Legal Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">About</h3>
            <p className="text-gray-600 text-sm">
              NyaySetu bridges the gap between citizens and legal knowledge, making legal information accessible to everyone.
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center text-xs md:text-sm text-gray-600">
          <p>© {new Date().getFullYear()} NyaySetu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
