import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleRight } from "../api/rightsApi";

function SectionList({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-3 text-emerald-400">
        {title}
      </h2>
      <ul className="list-disc ml-6 space-y-1 text-slate-300">
        {items.map((item, index) => (
          <li key={index}>
            {typeof item === "string"
              ? item
              : item.name
              ? `${item.name} (${item.section})`
              : JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightDetail() {
  const { category_slug, right_slug } = useParams();
  const [right, setRight] = useState(null);

  useEffect(() => {
    const fetchRight = async () => {
      try {
        const data = await getSingleRight(category_slug, right_slug);
        setRight(data);
      } catch (error) {
        console.error("Failed to load right:", error);
      }
    };

    fetchRight();
  }, [category_slug, right_slug]);

  if (!right) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">

      {/* Back */}
      <Link
        to={`/rights/${category_slug}`}
        className="text-emerald-400 hover:underline inline-block"
      >
        ← Back to Category
      </Link>

    <div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-emerald-400">
    {right.title}
  </h1>

  {right.severity && (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        right.severity === "CRITICAL"
          ? "bg-red-600 text-white"
          : right.severity === "HIGH"
          ? "bg-orange-500 text-white"
          : "bg-yellow-500 text-black"
      }`}
    >
      {right.severity}
    </span>
  )}
</div>

      <p className="text-slate-300">{right.summary}</p>

      {/* Plain Explanation */}
      {right.plainExplanation && (
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-emerald-400">
            Explanation
          </h2>
          <p className="text-slate-300 mb-2">
            {right.plainExplanation.whatItMeans}
          </p>
          <p className="text-slate-400">
            {right.plainExplanation.whyItMatters}
          </p>
        </div>
      )}

      <SectionList
        title="Who Can Use This Right"
        items={right.whoCanUseThisRight}
      />

      <SectionList
        title="Types of Abuse Covered"
        items={right.typesOfAbuseCovered}
      />

      <SectionList
        title="What Constitutes Violation"
        items={right.whatConstitutesViolation}
      />

      <SectionList
        title="Reliefs Available"
        items={right.reliefsAvailable}
      />

      <SectionList
        title="Step By Step Action"
        items={right.stepByStepAction}
      />

      {right.emergencyContacts && (
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-red-400 mb-3">
            Emergency Contacts
          </h2>
          <ul className="space-y-1 text-red-300">
            {right.emergencyContacts.map((contact, index) => (
              <li key={index}>
                {contact.service}: {contact.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RightDetail;