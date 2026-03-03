import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { FaClock, FaFileAlt, FaTrash, FaDownload, FaEye } from "react-icons/fa";

function formatDocType(type) {
  if (!type) return "Unknown";
  return String(type)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const d = new Date(dateString);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSeverityClasses(severity) {
  const level = (severity || "").toLowerCase();
  if (level === "high") return "bg-red-100 text-red-800";
  if (level === "medium") return "bg-yellow-100 text-yellow-800";
  if (level === "low") return "bg-green-100 text-green-800";
  return "bg-indigo-100 text-indigo-800";
}

function LegalHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [viewLoadingId, setViewLoadingId] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/legal/history");
      if (!response.ok) {
        throw new Error("Failed to load history.");
      }
      const data = await response.json();
      setItems(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleView = async (id) => {
    setViewLoadingId(id);
    try {
      const response = await fetch(
        `http://localhost:8000/legal/history/${encodeURIComponent(id)}`
      );
      if (!response.ok) {
        throw new Error("Failed to load analysis.");
      }
      const data = await response.json();
      navigate("/legal-analyzer", {
        state: {
          result: data,
          session_id: data.session_id,
          viewOnly: true,
        },
      });
    } catch (err) {
      console.error(err);
      addToast("Failed to open analysis. Please try again.", "error");
    } finally {
      setViewLoadingId(null);
    }
  };

  const handleDownload = async (id, filename) => {
    setDownloadingId(id);
    try {
      const response = await fetch(
        `http://localhost:8000/legal/history/${encodeURIComponent(id)}/pdf`
      );
      if (!response.ok) {
        throw new Error("Failed to download PDF.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(filename || "analysis")
        .split(".")[0]
        .replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast("PDF downloaded successfully.", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to download PDF.", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      const response = await fetch(
        `http://localhost:8000/legal/history/${encodeURIComponent(confirmId)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete analysis.");
      }
      addToast("Analysis deleted successfully.", "success");
      setConfirmId(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
      addToast("Failed to delete analysis.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 space-y-6 md:space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 md:space-y-3"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
              Analysis History
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Review your previously analyzed documents, download reports, or
              reopen an analysis.
            </p>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="space-y-3 md:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 md:h-28 bg-white/60 rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm md:text-base text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <span>{error}</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-sm md:text-base">
                No analysis history found yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              {items.map((item) => (
                <Card
                  key={item.id}
                  shadow="xl"
                  className="p-4 md:p-6 rounded-2xl border border-gray-100 space-y-3 md:space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center text-sm md:text-base text-gray-900 font-semibold">
                          <FaFileAlt className="mr-2 text-gray-500" />
                          {item.filename || "Untitled Document"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
                        <span>{formatDocType(item.doc_type)}</span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                    {item.severity && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium self-start ${getSeverityClasses(
                          item.severity
                        )}`}
                      >
                        {String(item.severity)
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleView(item.id)}
                      disabled={viewLoadingId === item.id}
                      fullWidth
                      className="sm:w-auto px-4 py-2 text-sm"
                    >
                      {viewLoadingId === item.id ? (
                        "Opening..."
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FaEye />
                          View
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDownload(item.id, item.filename)}
                      disabled={downloadingId === item.id}
                      fullWidth
                      className="sm:w-auto px-4 py-2 text-sm"
                    >
                      {downloadingId === item.id ? (
                        "Downloading..."
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FaDownload />
                          Download PDF
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setConfirmId(item.id)}
                      disabled={deletingId === item.id}
                      fullWidth
                      className="sm:w-auto px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaTrash />
                        Delete
                      </span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Confirmation Modal */}
          <AnimatePresence>
            {confirmId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 md:p-6 space-y-4"
                >
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Delete analysis?
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    This action cannot be undone. The analysis and its history will
                    be permanently removed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                    <Button
                      variant="primary"
                      onClick={handleDelete}
                      disabled={deletingId === confirmId}
                      fullWidth
                      className="sm:w-auto px-4 py-2 text-sm"
                    >
                      {deletingId === confirmId ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setConfirmId(null)}
                      fullWidth
                      className="sm:w-auto px-4 py-2 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}

export default LegalHistory;

