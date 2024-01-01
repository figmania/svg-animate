import { createController, createUIDelegate } from '@figmania/common'
import { ClipboardProvider, FigmaProvider, PluginUI } from '@figmania/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { NodeType } from './Schema'
import { AnalyticsProvider } from './providers/AnalyticsProvider'
import { HelpProvider } from './providers/HelpProvider'
import { NodeProvider } from './providers/NodeProvider'

const controller = createController(createUIDelegate())

createRoot(document.getElementById('root')!).render(
  <AnalyticsProvider token={import.meta.env.VITE_MIXPANEL_TOKEN}>
    <FigmaProvider controller={controller} defaultConfig={{ tutorial: true, userId: 'unknown' }}>
      <NodeProvider defaultValue={{ type: NodeType.NONE, paid: false, uuid: '' }}>
        <ClipboardProvider>
          <HelpProvider>
            <PluginUI className='theme-container' theme='midnight' minSize={{ width: 420, height: 337 }}>
              <App />
            </PluginUI>
          </HelpProvider>
        </ClipboardProvider>
      </NodeProvider>
    </FigmaProvider>
  </AnalyticsProvider>
)
