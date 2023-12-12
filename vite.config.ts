import { figma } from '@figmania/vite-plugin-figma'
import react from '@vitejs/plugin-react'
import { defineConfig, PluginOption } from 'vite'

export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = [react({
    fastRefresh: true
  }), figma(command, {
    editorType: ['figma', 'dev'],
    name: 'SVG Animate',
    api: '1.0.0',
    id: '980366185319754464',
    main: 'src/main.ts',
    capabilities: ['codegen', 'vscode'],
    codegenLanguages: [
      { label: 'SVG Animate (SVG)', value: 'svg-animate:svg' },
      { label: 'SVG Animate (HTML)', value: 'svg-animate:html' },
      { label: 'SVG Animate (Web Component)', value: 'svg-animate:web-component' }
    ],
    codegenPreferences: [{
      itemType: 'select',
      propertyName: 'trigger',
      label: 'Trigger',
      options: [
        { value: 'hover', label: 'Hover', isDefault: true },
        { value: 'loop', label: 'Loop' },
        { value: 'on', label: 'Load' },
        { value: 'off', label: 'Never' },
        { value: 'visible', label: 'Visible' }
      ],
      includedLanguages: ['svg-animate:html', 'svg-animate:web-component']
    }],
    permissions: ['currentuser'],
    networkAccess: { allowedDomains: ['none'], devAllowedDomains: ['http://localhost:8080'] }
  })]

  return {
    server: { host: 'localhost', port: 8080 },
    root: '.',
    base: './',
    build: { outDir: 'build' },
    plugins
  }
})
