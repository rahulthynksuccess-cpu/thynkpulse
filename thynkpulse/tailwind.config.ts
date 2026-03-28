import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream:    { DEFAULT: '#FDF6EC', 2: '#F5ECD8' },
        parchment:'#EDE0C8',
        teal:     { DEFAULT: '#0A5F55', 2: '#0D7A6D', 3: '#12A090' },
        coral:    { DEFAULT: '#E8512A', 2: '#F07250' },
        gold:     { DEFAULT: '#C9922A', 2: '#E5B64A' },
        plum:     '#3D1F5E',
        ink:      { DEFAULT: '#1A1208', 2: '#2D2416' },
        muted:    '#7A6A52',
      },
      fontFamily: {
        serif:  ['Fraunces', 'Georgia', 'serif'],
        sans:   ['Outfit', 'system-ui', 'sans-serif'],
        mono:   ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
