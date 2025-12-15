import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'rgb(34, 89, 230)',
        secondary: 'rgb(107, 110, 128)',
        'secondary-500': 'rgb(192, 147, 74)',
        lavender: 'rgb(209, 217, 229)',
        'light-blue': 'rgb(194, 222, 229)',
        'mimi-pink': 'rgb(242, 219, 227)',
        parchment: 'rgb(242, 232, 207)',
        'mint-green': 'rgb(207, 235, 232)',
        'anti-flash-white': 'rgb(245, 247, 250)',
        platinum: 'rgb(224, 229, 232)',
        'french-gray': 'rgb(196, 201, 207)',
        'slate-gray': 'rgb(117, 125, 140)',
        charcoal: 'rgb(51, 61, 77)',
        'rich-black': 'rgb(15, 23, 31)',
      },
    },
  },
} satisfies Config
