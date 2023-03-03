import react from '@vitejs/plugin-react'
import { defineConfig, PluginOption } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { figma } from './vite-plugin-figma'

export default defineConfig(({ command, mode }) => {
  const plugins: PluginOption[] = [react(), figma({
    editorType: ['figma'],
    name: 'SVG Animate',
    api: '1.0.0',
    id: '980366185319754464',
    main: 'src/main.ts',
    esbuild: { sourcemap: 'inline' }
  })]

  if (command === 'build') {
    plugins.push(viteSingleFile())
  }

  return {
    server: { host: 'localhost', port: 8080 },
    root: '.',
    base: './',
    build: {
      outDir: 'build',
      minify: mode === 'production',
      sourcemap: 'inline'
    },
    plugins
  }
})

