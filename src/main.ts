import { initDev } from './main/initDev'
import { initFigma } from './main/initFigma'

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  initDev()
} else if (figma.editorType === 'figma') {
  initFigma()
}
