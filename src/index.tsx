import { Theme } from '@figmania/ui'
import * as ReactDOM from 'react-dom'
import { Ui } from './components/Ui'

ReactDOM.render((
  <Theme className='theme-container' theme='dark'>
    <Ui />
  </Theme>
), document.getElementById('root'))
