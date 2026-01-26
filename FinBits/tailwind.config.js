/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#00b894',    // Emerald - Main accent
          secondary: '#a855f7',  // Violet - Secondary accent
          accent: '#06b6d4',     // Cyan - Tertiary accent
        },
        // Semantic Colors
        semantic: {
          success: '#10b981',    // Green
          warning: '#f59e0b',    // Amber
          danger: '#ef4444',     // Red
          info: '#3b82f6',       // Blue
        },
        // Dark Background Palette
        dark: {
          bg: '#000000',         // Pure black
          surface: '#0a0a0a',    // Slightly lighter
          card: '#0d0d0d',       // Card background
          hover: '#1a1a1a',      // Hover state
        },
      },
    },
  },
  plugins: [],
}