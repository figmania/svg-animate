import { SerializerSettings } from '@figmania/common'
import { initDev } from './main/initDev'
import { initFigma } from './main/initFigma'

SerializerSettings.getMaxTransitions = () => {
  return figma.payments?.status.type === 'PAID' ? 0 : 1
}

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  initDev()
} else if (figma.editorType === 'figma') {
  initFigma()
}
