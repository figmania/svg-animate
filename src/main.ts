import { SerializerSettings } from '@figmania/common'
import { initDev } from './main/initDev'
import { initFigma } from './main/initFigma'
import { figmaIsPaid } from './utils/figma'

SerializerSettings.getMaxTransitions = () => {
  return figmaIsPaid() ? 0 : 1
}

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  initDev()
} else if (figma.editorType === 'figma') {
  initFigma()
}
