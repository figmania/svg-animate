import { ExportFormat } from '../types/Export'
import { EMBED_URL } from './contants'

export function getFormattedCode(code: string, exportFormat: ExportFormat, trigger: string) {
  switch (exportFormat) {
    case 'svg': { return code }
    case 'element': { return `<svg-animate trigger="${trigger}">${code}</svg-animate>` }
    case 'html': { return `<html><head></head><body><svg-animate trigger="${trigger}">${code}</svg-animate><script src="${EMBED_URL}"></${'script'}></body></html>` }
    default: { return '</>' }
  }
}
