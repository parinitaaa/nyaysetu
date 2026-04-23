import { motion } from "framer-motion";

export default function Loader({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-indigo-500/20 border-t-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.2)]`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
