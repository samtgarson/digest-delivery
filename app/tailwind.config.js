// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

const linkHoverPlugin = plugin(function ({ addVariant }) {
  addVariant('link-hover', ({ container }) => {
    container.walkRules(rule => {
      rule.selector = `a:hover .link-hover\\:${rule.selector.slice(1)}`
    })
  })
})

const checkedSiblingPlugin = plugin(function ({ addVariant }) {
  addVariant('checked', ({ container }) => {
    container.walkRules(rule => {
      rule.selector = `:checked + .checked\\:${rule.selector.slice(1)}`
    })
  })
})

const placeholderShownPlugin = plugin(function ({ addVariant, e }) {
  addVariant('placeholder-shown', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.${e(
        `placeholder-shown${separator}${className}`
      )}:placeholder-shown`
    })
  })
})

module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false,
  important: '#main',
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
    placeholderColor: {
      blue: 'var(--blue-fade)'
    },
    fontFamily: {
      sans: [
        'custom',
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif'
      ]
    }
  },
  variants: {
    extend: {
      textDecoration: ['checked', 'placeholder-shown'],
      fontWeight: ['checked'],
      pointerEvents: ['checked'],
      margin: ['first', 'last'],
      padding: ['first', 'last'],
      animation: ['hover'],
      width: ['link-hover']
    }
  },
  plugins: [checkedSiblingPlugin, placeholderShownPlugin, linkHoverPlugin]
}
