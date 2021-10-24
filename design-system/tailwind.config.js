module.exports = {
  jit: true,
  purge: ['./lib/**/*.tsx', './lib/**/*.css', './docs/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      DEFAULT: '0px 1.5px 5px rgba(7, 0, 82, 0.07)',
      lg: '0px 2px 10px rgba(7, 0, 82, 0.25)'
    },
    colors: {
      bg: '#F6F6FB',
      dark: '#070052',
      white: '#fff',
      accent: '#1BF493',
      whiteFade: 'rgba(255, 255, 255, .3)',
      darkFade: 'rgba(7, 0, 82, .2)'
    },
    fontWeight: {
      normal: 400,
      bold: 600
    }
  },
  variants: {
    extend: {
      scale: ['active', 'hover']
    }
  },
  plugins: []
}
