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
      'white-fade': 'rgba(255, 255, 255, .3)',
      'dark-fade': 'rgba(7, 0, 82, .2)'
    },
    fontWeight: {
      normal: 400,
      bold: 600
    },
    fontSize: {
      sm: ['.875rem', '1.35rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.45rem', '2rem'],
      '2xl': ['2.25rem', '3rem'],
      '3xl': ['3.25rem', '4.25rem'],
      '4xl': ['4.5rem', '5.5rem']
    }
  },
  variants: {
    extend: {
      scale: ['active', 'hover'],
      margin: ['last']
    }
  },
  plugins: []
}
