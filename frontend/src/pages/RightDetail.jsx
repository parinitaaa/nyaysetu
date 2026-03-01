import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleRight } from "../api/rightsApi";

function Section({ title, children }) {
  if (!children) return null;

  return (
    <div className="bg-white shadow-md border border-blue-100 rounded-2xl p-6 space-y-3">
      <h2 className="text-xl font-semibold text-blue-700">
        {title}
      </h2>
      {children}
    </div>
  );
}

function RightDetail() {
  const { category_slug, right_slug } = useParams();
  const [right, setRight] = useState(null);

  useEffect(() => {
    getSingleRight(category_slug, right_slug).then(setRight);
  }, [category_slug, right_slug]);

  if (!right) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">

      {/* Back */}
      <Link
        to={`/rights/${category_slug}`}
        className="text-blue-600 hover:underline"
      >
        ← Back to Category
      </Link>

      {/* Title Card */}
      <div className="bg-white shadow-md border border-blue-100 rounded-2xl p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">
            {right.title}
          </h1>

          {right.severity && (
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              {right.severity}
            </span>
          )}
        </div>

        <p className="text-slate-600">
          {right.summary}
        </p>
      </div>

      {/* Explanation */}
      {right.plainExplanation && (
        <Section title="Plain Explanation">
          <p className="text-slate-700">
            {right.plainExplanation.whatItMeans}
          </p>
          <p className="text-slate-600">
            {right.plainExplanation.whyItMatters}
          </p>
        </Section>
      )}

      {/* Who Can Use */}
      {right.whoCanUseThisRight && (
        <Section title="Who Can Use This Right">
          <ul className="list-disc ml-6 text-slate-700 space-y-1">
            {right.whoCanUseThisRight.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Violations */}
      {right.whatConstitutesViolation && (
        <Section title="What Constitutes Violation">
          <ul className="list-disc ml-6 text-slate-700 space-y-1">
            {right.whatConstitutesViolation.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Reliefs */}
      {right.reliefsAvailable && (
        <Section title="Reliefs Available">
          <ul className="list-disc ml-6 text-slate-700 space-y-1">
            {right.reliefsAvailable.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Steps */}
      {right.stepByStepAction && (
        <Section title="Step-by-Step Action Plan">
          <ol className="list-decimal ml-6 text-slate-700 space-y-1">
            {right.stepByStepAction.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Section>
      )}

      {/* Emergency Contacts */}
      {right.emergencyContacts && (
        <Section title="Emergency Contacts">
          <ul className="text-slate-700 space-y-1">
            {right.emergencyContacts.map((contact, i) => (
              <li key={i}>
                <strong>{contact.service}</strong>: {contact.number}
              </li>
            ))}
          </ul>
        </Section>
      )}

    </div>
  );
}

export default RightDetail;