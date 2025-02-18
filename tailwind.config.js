/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#1B3D54', // Dark blue from header
          light: '#235375',
          dark: '#132C3E',
        },
        // Background colors
        background: {
          DEFAULT: '#F8FAFC', // Light background
          dark: '#1B3D54',    // Dark blue background
        },
        // Text colors
        text: {
          DEFAULT: '#2D3748',  // Default text
          light: '#FFFFFF',    // White text
          muted: '#94A3B8',    // Muted text
        },
        // Accent colors
        accent: {
          DEFAULT: '#3B82F6', // Bright blue for highlights
          light: '#60A5FA',
          dark: '#2563EB',
        },
        // Time display colors
        time: {
          DEFAULT: '#FFFFFF',  // White for time display
          secondary: '#E2E8F0', // Slightly muted for secondary time info
        }
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
//   presets: [require('nativewind/preset')],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#33A1DE',
//         bg: '#49A2DA',
//         secondary: '#F94C66',
//         background: '#F5F6F8',
//         text: '#2D3748',
//         accent: '#4A5568',
//       },
//     },
//   },
//   plugins: [],
// };
