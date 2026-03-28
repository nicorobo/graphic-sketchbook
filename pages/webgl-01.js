import { getWebGLCanvas } from '../src/utils'
import { createBasic2DProgram } from '../src/webgl/webgl-utils'
import Stats from 'stats.js'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

const width = 1000
const height = 1000
const [canvas, gl] = getWebGLCanvas('canvas', width, height)

const program = createBasic2DProgram(gl)
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
const positionBuffer = gl.createBuffer()

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
gl.enableVertexAttribArray(positionAttributeLocation)

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW,
  )
}

const size = 2
const type = gl.FLOAT
const normalize = false
const stride = 0
const offset = 0
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset,
)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.useProgram(program)
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

for (let i = 0; i < 50; ++i) {
  setRectangle(
    gl,
    randomInt(gl.canvas.width),
    randomInt(gl.canvas.height),
    randomInt(300),
    randomInt(300),
  )

  gl.uniform4f(
    colorUniformLocation,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  )

  const primitiveType = gl.TRIANGLES
  const count = 6
  gl.drawArrays(primitiveType, offset, count)
}
