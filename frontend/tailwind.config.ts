import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.1448 0 0)',
        foreground: 'oklch(0.9702 0 0)',
        card: 'oklch(0.1860 0 0)',
        'card-foreground': 'oklch(0.9702 0 0)',
        primary: 'oklch(0.8406 0.2028 153.9164)',
        secondary: 'oklch(0.2686 0 0)',
        muted: 'oklch(0.2686 0 0)',
        'muted-foreground': 'oklch(0.7155 0 0)',
        border: 'oklch(0.2686 0 0)',
      },
    },
  },
  plugins: [],
}
export default config
