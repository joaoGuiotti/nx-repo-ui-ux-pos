const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*.{html,ts}'),
    join(__dirname, '../../libs/**/*.{html,ts}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #4f46e5)',
          hover: 'var(--color-primary-hover, #4338ca)',
          active: 'var(--color-primary-active, #3730a3)',
        },
        surface: 'var(--color-surface, #ffffff)',
        background: 'var(--color-background, #f8fafc)',
        elevated: 'var(--color-elevated, #ffffff)',
        border: {
          DEFAULT: 'var(--color-border, #e2e8f0)',
          hover: 'var(--color-border-hover, #cbd5e1)',
        },
        'input-bg': 'var(--color-input-bg, #ffffff)',
        'feedback-error': 'var(--color-error, #dc2626)',
        'feedback-error-bg': 'var(--color-error-bg, #fef2f2)',
        'feedback-success': 'var(--color-success, #16a34a)',
        'feedback-success-bg': 'var(--color-success-bg, #f0fdf4)',
        disabled: 'var(--color-disabled, #94a3b8)',
        'on-disabled': 'var(--color-on-disabled, #e2e8f0)',
        'on-primary': 'var(--color-on-primary, #ffffff)',
      },
      textColor: {
        'text-primary': 'var(--color-text-primary, #0f172a)',
        'text-secondary': 'var(--color-text-secondary, #64748b)',
        'text-muted': 'var(--color-text-muted, #94a3b8)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm, 4px)',
        md: 'var(--radius-md, 8px)',
        lg: 'var(--radius-lg, 12px)',
        xl: 'var(--radius-xl, 16px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
