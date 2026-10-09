/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vouch: {
          dark: '#141715',
          charcoal: '#1A211D',
          teal: '#162B22',
          forest: '#162B22',
          forestDark: '#102019',
          forestMuted: '#243D32',
          emerald: '#245E3F',
          greenLight: '#E5EFE8',
          greenConfirmed: '#E5EFE8',
          canvas: '#F5F2EB',
          stone: '#ECE7DE',
          card: '#FAF8F4',
          border: '#DFD9CE',
          borderSubtle: '#E8E3DA',
          mutedText: '#727A75',
          copper: '#C2672B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
