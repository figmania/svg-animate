import { Theme } from '@figmania/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { MessengerProvider } from './providers/MessengerProvider'

createRoot(document.getElementById('root')!).render(
  <MessengerProvider>
    <Theme className='theme-container' theme='dark'>
      <App />
    </Theme>
  </MessengerProvider>
)
