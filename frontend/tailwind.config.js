/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - sustainable theme
        'green-primary': 'var(--color-green-primary)',
        'green-secondary': 'var(--color-green-secondary)',
        'green-accent': 'var(--color-green-accent)',
        'green-light': 'var(--color-green-light)',
        'green-subtle': 'var(--color-green-subtle)',
        
        // Eco colors - new sustainability palette
        'eco-primary': 'var(--color-eco-primary)',
        'eco-secondary': 'var(--color-eco-secondary)',
        'eco-accent': 'var(--color-eco-accent)',
        'eco-light': 'var(--color-eco-light)',
        'eco-subtle': 'var(--color-eco-subtle)',
        'carbon-neutral': 'var(--color-carbon-neutral)',
        'organic': 'var(--color-organic)',
        'renewable': 'var(--color-renewable)',
        
        // Semantic colors
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
        'info': 'var(--color-info)',
        
        // Surface colors
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        
        // Neutral scale
        'neutral': {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        }
      },
      fontFamily: {
        'sans': 'var(--font-sans)',
        'mono': 'var(--font-mono)',
        'eb-garamond': 'var(--font-eb-garamond)',
        'reem': ["var(--font-reemkufi)", "sans-serif"],
        'poppins': ["var(--font-poppins)", "sans-serif"],
        'inter': ["Inter", "sans-serif"],
        'nunito': ["Nunito Sans", "sans-serif"],
        'dancing-script': ['Dancing Script', 'cursive'],
      },
      fontSize: {
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },
      lineHeight: {
        'none': 'var(--leading-none)',
        'tight': 'var(--leading-tight)',
        'snug': 'var(--leading-snug)',
        'normal': 'var(--leading-normal)',
        'relaxed': 'var(--leading-relaxed)',
        'loose': 'var(--leading-loose)',
      },
      spacing: {
        '0': 'var(--spacing-0)',
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '3': 'var(--spacing-3)',
        '4': 'var(--spacing-4)',
        '5': 'var(--spacing-5)',
        '6': 'var(--spacing-6)',
        '8': 'var(--spacing-8)',
        '10': 'var(--spacing-10)',
        '12': 'var(--spacing-12)',
        '16': 'var(--spacing-16)',
        '20': 'var(--spacing-20)',
        '24': 'var(--spacing-24)',
      }
    },
  },
  plugins: [],
};
