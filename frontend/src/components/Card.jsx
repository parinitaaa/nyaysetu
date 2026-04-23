import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-8 hover:border-indigo-500/50 transition-colors duration-500 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
