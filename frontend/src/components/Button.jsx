import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const baseClasses = "px-6 py-3.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-glow hover:scale-105 shadow-xl active:scale-95",
    secondary: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg",
    ghost: "text-indigo-600 hover:bg-indigo-50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
