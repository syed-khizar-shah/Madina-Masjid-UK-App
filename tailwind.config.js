/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors - from the main blue theme
        primary: {
          DEFAULT: '#33A1DE', // Main blue color from the right panel
          light: '#42B0ED', // Slightly lighter blue for hover states
          dark: '#2991CB', // Darker blue for active states
        },
        // Background colors
        background: {
          DEFAULT: '#FFFFFF', // White background
          blue: '#33A1DE', // Blue background for right panel
        },
        // Text colors
        text: {
          DEFAULT: '#333333', // Default dark text
          light: '#FFFFFF', // White text
          blue: '#33A1DE', // Blue text color for prayer times
          muted: '#666666', // Muted text for secondary information
        },
        // Time display specific colors
        time: {
          DEFAULT: '#FFFFFF', // White time display
          label: '#CCCCCC', // Color for "HOURS", "MINUTES", "SECONDS" labels
          highlight: '#33A1DE', // Highlighted time segments
        },
        // Selected/Active state colors
        active: {
          DEFAULT: '#33A1DE', // Active item background
          text: '#FFFFFF', // Active item text
        },
        // Border colors
        border: {
          DEFAULT: '#E5E5E5', // Default border color
          light: '#FFFFFF20', // Light border with opacity
        }
      },
    },
  },
  plugins: [],
};