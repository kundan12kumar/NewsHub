/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E40AF', // Deep blue (primary) - blue-800
        'primary-50': '#EFF6FF', // Very light blue - blue-50
        'primary-100': '#DBEAFE', // Light blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-600': '#2563EB', // Darker blue - blue-600
        'primary-700': '#1D4ED8', // Dark blue - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate - slate-500
        'secondary-100': '#F1F5F9', // Light slate - slate-100
        'secondary-200': '#E2E8F0', // Lighter slate - slate-200
        'secondary-300': '#CBD5E1', // Light slate - slate-300
        'secondary-400': '#94A3B8', // Medium slate - slate-400
        'secondary-600': '#475569', // Darker slate - slate-600
        'secondary-700': '#334155', // Dark slate - slate-700
        'secondary-800': '#1E293B', // Very dark slate - slate-800
        
        // Accent Colors
        'accent': '#F59E0B', // Warm amber (accent) - amber-500
        'accent-100': '#FEF3C7', // Light amber - amber-100
        'accent-200': '#FDE68A', // Lighter amber - amber-200
        'accent-600': '#D97706', // Darker amber - amber-600
        'accent-700': '#B45309', // Dark amber - amber-700
        
        // Background Colors
        'background': '#FAFBFC', // Soft off-white background - gray-50
        'surface': '#FFFFFF', // Pure white surface - white
        
        // Text Colors
        'text-primary': '#1F2937', // Rich charcoal text - gray-800
        'text-secondary': '#6B7280', // Balanced gray text - gray-500
        
        // Status Colors
        'success': '#10B981', // Fresh green success - emerald-500
        'success-100': '#D1FAE5', // Light green - emerald-100
        'success-600': '#059669', // Darker green - emerald-600
        
        'warning': '#F59E0B', // Amber warning - amber-500
        'warning-100': '#FEF3C7', // Light amber - amber-100
        'warning-600': '#D97706', // Darker amber - amber-600
        
        'error': '#EF4444', // Clear red error - red-500
        'error-100': '#FEE2E2', // Light red - red-100
        'error-600': '#DC2626', // Darker red - red-600
        
        // Border Colors
        'border': '#E5E7EB', // Minimal border - gray-200
        'border-light': '#F3F4F6', // Light border - gray-100
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'], // Modern geometric sans-serif - Inter
        'body': ['Inter', 'sans-serif'], // Consistent with headings - Inter
        'caption': ['Inter', 'sans-serif'], // Visual consistency - Inter
        'data': ['JetBrains Mono', 'monospace'], // Monospace for data - JetBrains Mono
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '8px',
        'button': '4px',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'spring': 'spring 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spring: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '1000': '1000',
        '1010': '1010',
        '1015': '1015',
        '1020': '1020',
        '1030': '1030',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}