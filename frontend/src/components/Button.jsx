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
  const baseClasses = "relative px-8 py-4 rounded-2xl font-black transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:bg-indigo-500",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
    ghost: "text-indigo-400 hover:text-white transition-colors",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className} group`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
