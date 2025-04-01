import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans], // Add Poppins as the default sans-serif font
      },
      colors: {
        brand: {
          teal: '#008080', // Standard Teal
          cream: '#FFFDD0', // Cream
          'dark-blue': '#00008B', // Dark Blue
          'teal-light': '#40E0D0', // Lighter teal for gradients
          'cream-dark': '#F5F5DC', // Darker cream for gradients/accents
          'blue-light': '#ADD8E6', // Lighter blue for gradients/accents
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Example gradient using the theme colors
        "brand-gradient": "linear-gradient(to right, var(--tw-gradient-stops))",
        // Example gradients using utility classes:
        // bg-gradient-to-r from-brand-teal to-brand-cream
        // bg-gradient-to-b from-brand-cream to-brand-dark-blue
        // bg-gradient-to-tr from-brand-teal-light to-brand-blue-light
      },
    },
  },
  plugins: [],
};
export default config;
