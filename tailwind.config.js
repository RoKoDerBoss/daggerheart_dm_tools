/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#1a0f3a',
  			foreground: '#e2e8f0',
  			card: {
  				DEFAULT: '#2d1b69',
  				foreground: '#e2e8f0'
  			},
  			'card-border': '#4c1d95',
  			accent: {
  				DEFAULT: '#fbbf24',
  				foreground: '#1a0f3a',
  				hover: '#f59e0b'
  			},
  			muted: {
  				DEFAULT: '#2d1b69',
  				foreground: '#b0bbc7'
  			},
  			success: '#10b981',
  			warning: '#f59e0b',
  			error: '#ef4444',
  			popover: {
  				DEFAULT: '#2d1b69',
  				foreground: '#e2e8f0'
  			},
  			primary: {
  				DEFAULT: '#fbbf24',
  				foreground: '#1a0f3a'
  			},
  			secondary: {
  				DEFAULT: '#2d1b69',
  				foreground: '#e2e8f0'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#ffffff'
  			},
  			border: '#4c1d95',
  			input: '#4c1d95',
  			ring: '#fbbf24'
  		},
  		fontFamily: {
  			'cormorant': ['var(--font-cormorant)', 'Georgia', 'serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 