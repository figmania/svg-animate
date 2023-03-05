import { ClipboardProvider, ControllerProvider, PluginUI } from '@figmania/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <ControllerProvider>
    <ClipboardProvider>
      <PluginUI className='theme-container' theme='dark' minSize={{ width: 336, height: 250 }}>
        <App />
      </PluginUI>
    </ClipboardProvider>
  </ControllerProvider>
)
