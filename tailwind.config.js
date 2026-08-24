/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F7F4",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#14181F",
          soft: "#5B6472",
          faint: "#8A93A0",
        },
        primary: {
          DEFAULT: "#1F6F54",
          dark: "#14503B",
          light: "#E7F2ED",
        },
        accent: {
          DEFAULT: "#B8862E",
          light: "#F6ECD9",
        },
        border: "#E3E7E1",
        danger: {
          DEFAULT: "#C0392B",
          light: "#FBEAE8",
        },
        warning: {
          DEFAULT: "#B8860B",
          light: "#FBF3DE",
        },
        info: {
          DEFAULT: "#2E5FB8",
          light: "#E9F0FB",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,24,31,0.04), 0 4px 16px -4px rgba(20,24,31,0.08)",
        elevated: "0 8px 30px -8px rgba(20,24,31,0.18)",
      },
      maxWidth: {
        shell: "1360px",
      },
    },
  },
  plugins: [],
};
