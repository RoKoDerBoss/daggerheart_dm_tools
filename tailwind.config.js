/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-bg)",
        'card-border': "var(--card-border)",
        accent: "var(--accent)",
        'accent-hover': "var(--accent-hover)",
        muted: "var(--text-muted)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      fontFamily: {
        'cormorant-upright': ['"Cormorant Upright"', 'serif'],
      },
    },
  },
  plugins: [],
} 