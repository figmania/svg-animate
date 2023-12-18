import { createController, createUIDelegate } from '@figmania/common'
import { ClipboardProvider, FigmaProvider, PluginUI } from '@figmania/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { NodeType } from './Schema'
import { NodeProvider } from './providers/NodeProvider'

const controller = createController(createUIDelegate())

createRoot(document.getElementById('root')!).render(
  <FigmaProvider controller={controller} defaultConfig={{ tutorial: true, userId: 'unknown' }}>
    <NodeProvider defaultValue={{ type: NodeType.NONE, paid: true }}>
      <ClipboardProvider>
        <PluginUI className='theme-container' theme='midnight' minSize={{ width: 420, height: 297 }}>
          <App />
        </PluginUI>
      </ClipboardProvider>
    </NodeProvider>
  </FigmaProvider>
)
