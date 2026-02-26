import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RightDetail = () => {
  const { slug, rightFile } = useParams();
  const [rightData, setRightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5004/rights/${slug}/${rightFile}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch right details");
        return res.json();
      })
      .then((data) => {
        setRightData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug, rightFile]);

  if (loading) return <p>Loading right details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!rightData) return <p>No details found.</p>;

  return (
    <div className="right-detail">
      <h1 className="right-detail h1">{rightData.title}</h1>
      <p className="right-detail p">{rightData.summary}</p>

      {rightData.plainExplanation && (
        <div className="mb-4">
          <h2 className="right-detail h2">What it means</h2>
          <p>{rightData.plainExplanation.whatItMeans}</p>
          <p className="right-detail p">{rightData.plainExplanation.whyItMatters}</p>
        </div>
      )}

      {rightData.legalBasis?.acts && (
        <div className="mb-4">
          <h2 className="right-detail h2">Legal Basis</h2>
          <ul className="list-disc ml-5">
            {rightData.legalBasis.acts.map((act, idx) => (
              <li key={idx}>{act.name} - {act.section}</li>
            ))}
          </ul>
        </div>
      )}

      {rightData.stepByStepAction && (
        <div className="mb-4">
          <h2 className="right-detail h2">Steps to Take</h2>
          <ol className="list-decimal ml-5">
            {rightData.stepByStepAction.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {rightData.exampleScenario && (
        <div className="mb-4">
          <h2 className="right-detail h2">Example</h2>
          <p>{rightData.exampleScenario.situation}</p>
          {rightData.exampleScenario.isViolation && (
            <p className="right-detail p">{rightData.exampleScenario.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RightDetail;