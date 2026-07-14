import { Resvg } from '@resvg/resvg-js'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.join(root, '../public/og-share.svg')
const pngPath = path.join(root, '../public/og-share.png')

const fontFiles = [
  require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff'),
  require.resolve('@fontsource/inter/files/inter-latin-600-normal.woff'),
  require.resolve('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'),
]

const svg = fs.readFileSync(svgPath, 'utf8')
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles,
    loadSystemFonts: false,
    defaultFontFamily: 'Inter',
  },
})

fs.writeFileSync(pngPath, resvg.render().asPng())
console.log(`Wrote ${pngPath}`)
