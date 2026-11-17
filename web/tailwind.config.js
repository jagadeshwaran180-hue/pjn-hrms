/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6338DF',
          purpleHover: '#5229cb',
          purpleLight: '#F0ECFC',
          sidebar: '#161A3D',
          sidebarHover: '#1f2452',
          bg: '#F7F7FC',
          border: '#EAEAEF',
          textDark: '#1E2238',
          textMuted: '#6B7280'
        },
        status: {
          present: '#10B981',
          presentBg: '#ECFDF5',
          pending: '#F59E0B',
          pendingBg: '#FFFBEB',
          absent: '#EF4444',
          absentBg: '#FEF2F2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px'
      }
    },
  },
  plugins: [],
}
