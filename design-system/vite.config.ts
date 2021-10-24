import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import * as React from 'react'`
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'digest-delivery',
      fileName: format => `digest-delivery.${format}.js`
    },
    sourcemap: true,
    outDir: './dist',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'dashes'
    }
  }
})
