import * as path from 'path'
import * as fs from 'fs-extra'
import { compiled } from '@bill-doc/doc-utils'
import { format } from '@bill-doc/doc-utils'

import * as paths from '../config/paths'

export const fromTemplates = (file: string) => {
  return path.join(paths.templates, file)
}

export const outputFileFromTemplate = async (
  templatePath: string,
  outputPath: string,
  templateProps?: Record<string, any>,
  compileProps?: Record<string, any>,
) => {
  const filepath = fromTemplates(templatePath)
  const template = await compiled(filepath, compileProps || { minimize: false })
  const file = template(templateProps || {})
  const raw = await format(file)
  await fs.outputFile(outputPath, raw)
}
