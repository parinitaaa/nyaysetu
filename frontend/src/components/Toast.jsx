import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const toastVariants = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: FaCheckCircle,
    iconColor: "text-green-600",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: FaExclamationTriangle,
    iconColor: "text-red-600",
    text: "text-red-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: FaInfoCircle,
    iconColor: "text-blue-600",
    text: "text-blue-800",
  },
};

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const variant = toastVariants[toast.type] || toastVariants.info;
          const Icon = variant.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`${variant.bg} ${variant.border} border-2 rounded-xl shadow-xl p-4 min-w-[300px] max-w-md flex items-start gap-3`}
            >
              <Icon className={`${variant.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className={`${variant.text} text-sm font-medium`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`${variant.text} hover:opacity-70 transition-opacity flex-shrink-0`}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
