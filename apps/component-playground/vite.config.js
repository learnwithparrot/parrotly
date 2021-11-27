import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      // these are the aliases and paths to them
      '@parrotly.io/constants': path.resolve('../../libs/constants/src'),
      '@parrotly.io/env': path.resolve('../../env.ts'),
      '@parrotly.io/types': path.resolve('../../libs/types/src/index.ts'),
      '@parrotly.io/ui/utils': path.resolve('../../libs/ui/src/utils/index.ts'),
      '@parrotly.io/ui': path.resolve('../../libs/ui/src/index.ts'),
      '@parrotly.io/extension-components': path.resolve('../../libs/extension-components/src/index.ts'),
      '$libs': path.resolve('./src/libs'),
    }
  }
})
