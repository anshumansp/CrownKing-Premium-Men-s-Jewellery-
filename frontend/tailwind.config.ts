import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E212B',
          secondary: '#E5DFD0',
          'cream-light': '#F5F2E3',
          'cream-dark': '#E5DFD0',
          'blue-dark': '#1E212B',
          'blue-light': '#384152',
          white: '#FFFFFF',
          'gray-light': '#F8F8F8',
          'gray-medium': '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
