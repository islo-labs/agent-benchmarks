import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.join(root, '../public/og-share.svg')
const pngPath = path.join(root, '../public/og-share.png')

const svg = fs.readFileSync(svgPath, 'utf8')
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
fs.writeFileSync(pngPath, resvg.render().asPng())

console.log(`Wrote ${pngPath}`)
