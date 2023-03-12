import { figma } from '@figmania/vite-plugin-figma'
import react from '@vitejs/plugin-react'
import { defineConfig, PluginOption } from 'vite'

export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = [react({
    fastRefresh: true
  }), figma(command, {
    editorType: ['figma'],
    name: 'SVG Animate',
    api: '1.0.0',
    id: '980366185319754464',
    main: 'src/main.ts',
    permissions: ['currentuser']
  })]

  return {
    server: { host: 'localhost', port: 8080 },
    root: '.',
    base: './',
    build: { outDir: 'build' },
    plugins
  }
})
