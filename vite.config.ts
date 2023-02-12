import { figma } from '@figmania/vite-plugin-figma'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: '.',
  base: './',
  server: { host: 'localhost', port: 8080 },
  build: { outDir: 'build' },
  plugins: [react(), figma({
    editorType: ['figma'],
    name: 'SVG Animate',
    api: '1.0.0',
    id: '980366185319754464',
    main: 'src/main.ts'
  }), viteSingleFile()]
})
