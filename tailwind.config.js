module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      current: 'current-color',
      transparent: 'transparent',
      green: 'var(--green)',
      blue: 'var(--blue)',
      pink: 'var(--pink)',
      white: 'var(--white)'
    },
    fontFamily: {
      sans: ['custom', 'BlinkMacSystemFont', '-apple-system', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
