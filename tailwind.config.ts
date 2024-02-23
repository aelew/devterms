import type { Config } from 'tailwindcss';

const svgToDataUri = require('mini-svg-data-uri');

const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette
} = require('tailwindcss/lib/util/flattenColorPalette');

const config = {
  darkMode: ['class'],
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1000px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      transitionProperty: {
        'color-transform':
          'color, background-color, border-color, text-decoration-color, fill, stroke, transform'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ matchUtilities, theme }: unknown) {
      matchUtilities(
        {
          'bg-grid': (value: string) => {
            const dataUri = svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="${value}"><path d="M0 .5H31.5V32" /></svg>`
            );
            return { backgroundImage: `url("${dataUri}")` };
          }
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    }
  ]
} satisfies Config;

export default config;
