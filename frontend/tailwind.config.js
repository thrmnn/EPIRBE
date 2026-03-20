/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        radio: {
          // Surface hierarchy
          'surface-base': '#08080d',
          'surface-1': '#101018',
          'surface-2': '#1a1a25',
          'surface-3': '#242433',
          'surface-highlight': '#2a2a3d',

          // Borders
          'border-subtle': '#1e1e2e',
          'border-default': '#2d2d42',
          'border-strong': '#3d3d57',
          'border-focus': '#e8924b',

          // Primary (Broadcast Amber)
          primary: '#e8924b',
          'primary-hover': '#f0a565',
          'primary-active': '#d07a35',
          'primary-muted': '#e8924b26',
          'primary-subtle': '#1f1610',

          // Secondary (Studio Cyan)
          secondary: '#5ba4c9',
          'secondary-hover': '#74b8dc',
          'secondary-active': '#4890b5',
          'secondary-muted': '#5ba4c926',
          'secondary-subtle': '#0f161b',

          // Semantic
          success: '#34d399',
          'success-muted': '#34d39918',
          'success-subtle': '#0f1f19',
          warning: '#f0b429',
          'warning-muted': '#f0b42918',
          'warning-subtle': '#1f1a0f',
          error: '#f06060',
          'error-muted': '#f0606018',
          'error-subtle': '#1f1010',
          info: '#5ba4c9',
          'info-muted': '#5ba4c918',
          'info-subtle': '#0f161b',

          // Text hierarchy
          'text-primary': '#ededf0',
          'text-secondary': '#a8a8b8',
          'text-tertiary': '#6e6e82',
          'text-disabled': '#45455a',

          // Interactive
          'hover-overlay': '#ffffff0a',
          'active-overlay': '#ffffff12',
          'focus-ring': '#e8924b',
          'focus-ring-offset': '#08080d',

          // Live / On-Air
          live: '#ff3b3b',
          'live-glow': '#ff3b3b60',
          'live-bg': '#ff3b3b15',

          // --- Legacy aliases (keep until all components are migrated) ---
          bg: '#08080d',
          surface: '#101018',
          border: '#1e1e2e',
          accent: '#e8924b',
          text: '#ededf0',
          muted: '#a8a8b8',
        },
      },

      fontFamily: {
        display: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        body: ["'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
        mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.5',  letterSpacing: '0.02em' }],
        sm:   ['0.875rem', { lineHeight: '1.5',  letterSpacing: '0.01em' }],
        base: ['1rem',     { lineHeight: '1.6',  letterSpacing: '0em' }],
        lg:   ['1.125rem', { lineHeight: '1.5',  letterSpacing: '-0.005em' }],
        xl:   ['1.25rem',  { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem',  { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem',{ lineHeight: '1.3',  letterSpacing: '-0.02em' }],
        '4xl': ['2.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.025em' }],
      },

      borderRadius: {
        sm:    '6px',
        md:    '10px',
        lg:    '16px',
        xl:    '24px',
        full:  '9999px',
        round: '50%',
      },

      boxShadow: {
        sm:          '0 1px 2px 0 rgba(0,0,0,0.4), 0 1px 3px 0 rgba(0,0,0,0.3)',
        md:          '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)',
        lg:          '0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.5)',
        xl:          '0 20px 25px -5px rgba(0,0,0,0.7), 0 8px 10px -6px rgba(0,0,0,0.6)',
        inner:       'inset 0 2px 4px 0 rgba(0,0,0,0.4)',
        'glow-sm':   '0 0 8px 0 rgba(232,146,75,0.25)',
        'glow-md':   '0 0 16px 2px rgba(232,146,75,0.3)',
        'glow-lg':   '0 0 24px 4px rgba(232,146,75,0.35)',
        'glow-live': '0 0 20px 4px rgba(255,59,59,0.4)',
        'glow-cool': '0 0 16px 2px rgba(91,164,201,0.25)',
      },

      keyframes: {
        'eq-1': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        },
        'eq-2': {
          '0%, 100%': { height: '12px' },
          '50%': { height: '4px' },
        },
        'eq-3': {
          '0%, 100%': { height: '8px' },
          '50%': { height: '16px' },
        },
        slideUp: {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(1rem)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rowFlash: {
          '0%': { backgroundColor: 'transparent' },
          '30%': { backgroundColor: 'rgba(232,146,75,0.2)' },
          '100%': { backgroundColor: 'transparent' },
        },
        liveGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,59,59,0.4)' },
          '50%': { boxShadow: '0 0 8px 2px rgba(255,59,59,0.2)' },
        },
        pulseLive: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        messageIn: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'eq-1':        'eq-1 0.8s ease-in-out infinite',
        'eq-2':        'eq-2 0.6s ease-in-out infinite',
        'eq-3':        'eq-3 0.9s ease-in-out infinite',
        'slide-up':    'slideUp 300ms ease-out',
        'slide-out':   'slideOut 200ms ease-in forwards',
        'fade-in':     'fadeIn 200ms ease-out',
        'fade-out':    'fadeOut 150ms ease-in forwards',
        'scale-in':    'scaleIn 200ms ease-out',
        'row-flash':   'rowFlash 600ms ease-out',
        'live-glow':   'liveGlow 2s ease-in-out infinite',
        'pulse-live':  'pulseLive 2s ease-in-out infinite',
        'shake':       'shake 300ms ease-in-out',
        'shimmer':     'shimmer 1.5s ease-in-out infinite',
        'message-in':  'messageIn 200ms ease-out',
        'scale-pulse': 'scalePulse 250ms ease-out',
        'spin':        'spin 1s linear infinite',
      },

      transitionDuration: {
        instant: '50ms',
        fast:    '100ms',
        base:    '200ms',
        slow:    '300ms',
        slower:  '500ms',
      },

      transitionTimingFunction: {
        'ease-default': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'ease-in':      'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out':     'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-spring':  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
