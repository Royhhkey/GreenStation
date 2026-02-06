/** @type {import('tailwindcss').Config} */ 
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        'theme-primary': 'var(--theme-primary)',
        'theme-primary-hover': 'var(--theme-primaryHover)',
        'theme-primary-active': 'var(--theme-primaryActive)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-bg': 'var(--theme-background)',
        'theme-surface': 'var(--theme-surfaceBackground)',
        'theme-card': 'var(--theme-cardBackground)',
        'theme-text': 'var(--theme-textPrimary)',
        'theme-text-secondary': 'var(--theme-textSecondary)',
        'theme-text-tertiary': 'var(--theme-textTertiary)',
        'theme-border': 'var(--theme-border)',
        'theme-border-light': 'var(--theme-borderLight)',
      },
      spacing: {
        'theme-xs': 'var(--spacing-xs)',
        'theme-sm': 'var(--spacing-sm)',
        'theme-md': 'var(--spacing-md)',
        'theme-lg': 'var(--spacing-lg)',
        'theme-xl': 'var(--spacing-xl)',
        'theme-2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        'theme-sm': 'var(--radius-sm)',
        'theme-md': 'var(--radius-md)',
        'theme-lg': 'var(--radius-lg)',
        'theme-xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'theme': '0 4px 6px -1px var(--theme-shadow), 0 2px 4px -1px var(--theme-shadow)',
        'theme-md': '0 10px 15px -3px var(--theme-shadowMedium), 0 4px 6px -2px var(--theme-shadowMedium)',
        'theme-lg': '0 20px 25px -5px var(--theme-shadowHeavy), 0 10px 10px -5px var(--theme-shadowHeavy)',
      },
      backgroundImage: {
        'theme-gradient': 'var(--theme-gradient)',
        'theme-surface-gradient': 'var(--theme-surfaceGradient)',
      },
      animation: {
        'gradient-shift': 'gradientShift 20s ease infinite',
        'rotate': 'rotate 20s linear infinite',
        'shimmer': 'shimmer 1.2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          'from': { transform: 'translateY(-10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
    },
  },
  plugins: [],
};