// Builds the whole site into ONE self-contained html file (hash routing) for easy previewing/sharing.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: {
    'import.meta.env.VITE_HASH': JSON.stringify('1'),
  },
  build: { outDir: 'dist-single', emptyOutDir: true },
})
