import { Link } from "react-router-dom";
import {
  FaGavel,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

      <div className="max-w-6xl mx-auto px-6 py-20 text-center">

        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700">
          Smarter Legal Decisions Start Here
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          NyaySetu helps you predict legal case outcomes, understand your
          rights, and get instant legal guidance — all in one intelligent platform.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/predict"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Predict Your Case Outcome
          </Link>

          <Link
            to="/rights"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Discover Your Legal Rights
          </Link>

          <Link
            to="/chatbot"
            className="border border-slate-400 hover:border-blue-600 hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition"
          >
            Talk to AI Legal Assistant
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-10 text-left">

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaGavel className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">
              Case Outcome Prediction
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Analyze court type, state, and case category to estimate the
              probability of a favorable legal decision.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaShieldAlt className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">
            Know Your Rights
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Access categorized legal rights with simplified explanations and
              actionable steps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaRobot className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">
              AI-Powered Legal Assistant
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Ask legal questions and receive contextual responses instantly
              through natural language processing.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Landing;