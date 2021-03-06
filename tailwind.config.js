// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin")

const checkedSiblingPlugin = plugin(function ({ addVariant }) {
  addVariant("checked", ({ container }) => {
    container.walkRules(rule => {
      rule.selector = `:checked + .checked\\:${rule.selector.slice(1)}`
    })
  })
})

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      green: 'var(--green)',
      blue: 'var(--blue)',
      pink: 'var(--pink)',
      white: 'var(--white)',
      whiteFade: 'var(--white-fade)'
    },
    fontFamily: {
      sans: ['custom', 'BlinkMacSystemFont', '-apple-system', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
    }
  },
  variants: {
    extend: {
      textDecoration: ['checked'],
      fontWeight: ['checked'],
      pointerEvents: ['checked'],
      margin: ['first']
    }
  },
  plugins: [checkedSiblingPlugin]
}
