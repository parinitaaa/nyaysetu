/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // indigo-600
        accent: "#9333EA", // purple-600
        secondary: "#6366F1",
        soft: "#F8FAFC",
        darkText: "#1E293B"
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(79, 70, 229, 0.3)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem",
      }
    }
  },
  plugins: [],
}
