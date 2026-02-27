import { useEffect, useState } from "react";
import { predictCase } from "../api/predictApi";
import { getOptions } from "../api/optionsApi";

function Predict() {
  const [options, setOptions] = useState(null);
  const [formData, setFormData] = useState({
    state: "",
    court_type: "",
    case_type: "",
    public_interest: "No",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      const data = await getOptions();
      setOptions(data);
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const data = await predictCase(formData);
    setResult(data);
    setLoading(false);
  };

  if (!options) return <div className="p-8">Loading options...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">

      <h1 className="text-4xl font-bold text-blue-700">
        Predict Your Case Outcome
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md border border-blue-100 rounded-2xl p-8 grid md:grid-cols-2 gap-6"
      >
        {["state", "court_type", "case_type"].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-1 text-slate-600 capitalize">
              {field.replace("_", " ")}
            </label>
            <select
              name={field}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select</option>
              {options[field + "s"]?.map((item) => (
                <option key={item} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1 text-slate-600">
            Public Interest
          </label>
          <select
            name="public_interest"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {options.public_interest.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition"
          >
            {loading ? "Predicting..." : "Analyze Case"}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white shadow-md border border-blue-100 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-blue-700">
            Prediction Result
          </h2>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">
              {result.prediction.outcome}
            </p>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              {result.prediction.confidence}%
            </span>
          </div>

          <div className="h-3 bg-slate-200 rounded-full">
            <div
              className="h-3 bg-blue-600 rounded-full"
              style={{
                width: `${result.prediction.favorable_probability}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Predict;