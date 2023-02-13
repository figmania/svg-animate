import { Theme } from '@figmania/ui'
import { createRoot } from 'react-dom/client'
import { App } from './components/App'
import { FigmaProvider } from './providers/FigmaProvider'

createRoot(document.getElementById('root')!).render(
  <FigmaProvider>
    <Theme className='theme-container' theme='dark'>
      <App />
    </Theme>
  </FigmaProvider>
)
