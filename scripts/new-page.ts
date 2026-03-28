#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const input = process.argv[2]

const use3d = process.argv[3] == '--3d'

if (!input) {
  console.log('Usage: bun scripts/new-page.ts <page-name>')
  process.exit(1)
}

const name = input
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9\-]/g, '')

const pagesDir = './pages'
mkdirSync(pagesDir, { recursive: true })

const htmlPath = join(pagesDir, `${name}.html`)
const tsPath = join(pagesDir, `${name}.ts`)

if (existsSync(htmlPath) || existsSync(tsPath)) {
  console.log('❌ Page already exists.')
  process.exit(1)
}

writeFileSync(
  htmlPath,
  `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <link href="./style.css" rel="stylesheet" />
</head>
<body>
    <canvas id="canvas"></canvas>
    <script type="module" src="./${name}.ts"></script>
</body>
</html>
`,
)

const templateCanvas2d = `
  import { getCanvas } from '../src/utils'

  const width = 1000
  const height = 1000
  const [canvas, ctx] = getCanvas('canvas', width, height)

  let t = 0

  function render() {
    ctx.clearRect(0, 0, width, height)
    t+=1
    requestAnimationFrame(render)
  }
  render()
`

const templateCanvas3d = `
  
import { getWebGLCanvas } from '../src/utils'
import { createBasicProgram } from '../src/webgl/webgl-utils'

const [canvas, gl] = getWebGLCanvas('canvas', 1000, 1000)

const program = createBasicProgram(gl)
gl.useProgram(program)

const uLocations = {
  projection: gl.getUniformLocation(program, 'u_projection'),
  modelView: gl.getUniformLocation(program, 'u_modelView'),
  normal: gl.getUniformLocation(program, 'u_normal'),
  color: gl.getUniformLocation(program, 'u_color'),
}

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

const setAttr = (
  gl: WebGL2RenderingContext,
  arr: number[],
  attr: string,
  size: number,
) => {
  const location = gl.getAttribLocation(program, attr)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(location)
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
}

const setPositionAttr = (gl: WebGL2RenderingContext, arr: number[]) => {
  setAttr(gl, arr, 'a_position', 3)
}
`

writeFileSync(tsPath, use3d ? templateCanvas3d : templateCanvas2d)

console.log(`✅ Created page: ${name}`)
