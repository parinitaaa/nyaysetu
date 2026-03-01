import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
  shadow = "xl",
  border = false,
  ...props
}) {
  const shadowClasses = {
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    soft: "shadow-soft",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl ${shadowClasses[shadow]} ${
        border ? "border border-gray-100" : ""
      } p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
