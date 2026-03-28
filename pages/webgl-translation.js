import { getWebGLCanvas } from '../src/utils'
import { m3 } from '../src/webgl/m3'
import { createBasic2DProgram } from '../src/webgl/webgl-utils'

const resolution = [1000, 1000]
const [canvas, gl] = getWebGLCanvas('canvas', resolution[0], resolution[1])

const width = 175
const height = 300
const translation = [100, 100]

const angleInDegrees = -10
const rotationInRadians = (angleInDegrees * Math.PI) / 180

const scale = [0.85, 0.85]

const color = [Math.random(), Math.random(), Math.random(), 1]

const program = createBasic2DProgram(gl)

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
const positionBuffer = gl.createBuffer()

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const vao = gl.createVertexArray()

gl.bindVertexArray(vao)
gl.enableVertexAttribArray(positionAttributeLocation)

const colorLocation = gl.getUniformLocation(program, 'u_color')
const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

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

const setFGeometry = (gl, width, height, thickness) => {
  const staff = [
    0,
    0,
    thickness,
    0,
    thickness,
    height,
    thickness,
    height,
    0,
    0,
    0,
    height,
  ]
  const topRung = [
    thickness,
    0,
    thickness,
    thickness,
    width,
    0,
    width,
    0,
    thickness,
    thickness,
    width,
    thickness,
  ]
  const yOffset = height / 3
  const ratio = 0.8
  const bottomRung = [
    thickness,
    yOffset,
    thickness,
    thickness + yOffset,
    width * ratio,
    yOffset,
    width * ratio,
    yOffset,
    thickness,
    thickness + yOffset,
    width * ratio,
    thickness + yOffset,
  ]
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([...staff, ...topRung, ...bottomRung]),
    gl.STATIC_DRAW,
  )
}

setFGeometry(gl, width, height, 50)
function drawScene() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  gl.bindVertexArray(vao)

  const projectionMatrix = m3.projection(
    gl.canvas.clientWidth,
    gl.canvas.clientHeight,
  )
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.uniform4fv(colorLocation, color)

  const primitiveType = gl.TRIANGLES
  const count = 18

  var translationMatrix = m3.translation(translation[0], translation[1])
  var rotationMatrix = m3.rotation(rotationInRadians)
  var scaleMatrix = m3.scaling(scale[0], scale[1])

  let matrix = projectionMatrix

  for (let i = 0; i < 100; i++) {
    matrix = m3.multiply(matrix, translationMatrix)
    matrix = m3.multiply(matrix, rotationMatrix)
    matrix = m3.multiply(matrix, scaleMatrix)

    gl.uniformMatrix3fv(matrixLocation, false, matrix)

    gl.drawArrays(primitiveType, offset, count)
  }
}

drawScene()
