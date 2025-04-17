/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        fontFamily: {
          normal: ["normal"],
          medium: ["medium"],
          bold: ["bold"],
          italic: ["italic"],
        },
      },
      colors: {
        primary: {
          100: "#E6F0FF", // light blue
          200: "#80BFFF", // medium blue
          300: "#007FFF", // base
        },
        secondary: {
          100: "#FAFBFC", //background
          200: "#F5F7FA",
          300: "#F5F7FA",
        },
        tertiary: {
          300: "#34C759"
        },
        input: {
          100: "#FCFCFC", // input background
          200: "#FAFAFA",
          300: "#F0F0F0",
        },
        border: {
          100: "#EDEDED", // input border
          200: "#DDDDDD",
          300: "#5A5660",
        },
        text: {
          100: "#999999", // input text or normal text
          200: "#666666",
          300: "#5A5660",
        },
        card: {
          100: "#E3F2FD"
        }
      },
      boxShadow: {
        "custom-card": "0px 6px 12px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        lg: '10px',
      },
    },
  },
  plugins: [],
};
