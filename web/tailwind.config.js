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
          navy: '#151936',
          purple: '#6534E8',
          purpleHover: '#5425d0',
          purpleLight: '#F4F0FD',
          sidebar: '#151936',
          sidebarHover: '#1E234A',
          bg: '#F6F5FC',
          border: '#E5E2F0',
          textDark: '#111827',
          textMuted: '#64748B',
        },
        status: {
          present: '#10B981',
          presentBg: '#ECFDF5',
          pending: '#F59E0B',
          pendingBg: '#FFFBEB',
          absent: '#EF4444',
          absentBg: '#FEF2F2',
          hybrid: '#6534E8',
          hybridBg: '#F4F0FD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '10px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(17, 24, 39, 0.04)',
        'sm': '0 1px 3px 0 rgba(17, 24, 39, 0.06), 0 1px 2px -1px rgba(17, 24, 39, 0.06)',
        'card': '0 2px 4px 0 rgba(21, 25, 54, 0.04), 0 1px 2px -1px rgba(21, 25, 54, 0.03)',
        'purple': '0 4px 14px 0 rgba(101, 52, 232, 0.22)',
      },
      animation: {
        'page-fade': 'pageFade 150ms ease-out forwards',
        'modal-lift': 'modalLift 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pageFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalLift: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
