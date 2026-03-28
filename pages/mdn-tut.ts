import { mat4 } from 'gl-matrix'
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

const setColorAttr = (gl: WebGL2RenderingContext, arr: number[]) => {
  setAttr(gl, arr, 'a_color', 4)
}

const setNormalsAttr = (gl: WebGL2RenderingContext, arr: number[]) => {
  setAttr(gl, arr, 'a_normal', 3)
}

const positions = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
]

const vertexNormals = [
  // Front
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

  // Back
  0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

  // Top
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // Bottom
  0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

  // Right
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

  // Left
  -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
]

const faceColors = [
  [0, 1, 0, 1], // Front face: white
  [0, 1, 0, 1], // Back face: red
  [0, 1, 1, 1], // Top face: green
  [0, 1, 1, 1], // Bottom face: blue
  [1, 0.5, 1, 1], // Right face: yellow
  [1, 0.5, 1, 1], // Left face: purple
]

let colors: number[] = []
for (const c of faceColors) {
  colors = colors.concat(c, c, c, c)
}

setColorAttr(gl, colors)
setPositionAttr(gl, positions)
setNormalsAttr(gl, vertexNormals)

const indices = new Uint16Array([
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23, // left
])

const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

const fieldOfView = (45 * Math.PI) / 180 // in radians
const aspect = canvas.clientWidth / canvas.clientHeight
const zNear = 0.1
const zFar = 100.0
const cubes = [
  { position: [0, 0, -9], scale: 1, rotationSpeed: [1, 0.7, 0.3] },
  { position: [-2, 0, -9], scale: 0.5, rotationSpeed: [0.7, 1, 0.3] },
  { position: [2, 0, -12], scale: 0.3, rotationSpeed: [0.2, 2, 3] },
]

const drawScene = (rotation: number) => {
  gl.clearDepth(1.0) // Clear everything
  gl.enable(gl.DEPTH_TEST) // Enable depth testing
  gl.depthFunc(gl.LEQUAL) // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  const projection = mat4.create()
  mat4.perspective(projection, fieldOfView, aspect, zNear, zFar)
  // mat4.ortho(projection, -2, 2, -2, 2, zNear, zFar)

  // const modelView = mat4.create()
  // mat4.translate(modelView, modelView, [0, 0, -9])
  // mat4.rotate(modelView, modelView, rotation, [1, 0, 0])
  // mat4.rotate(modelView, modelView, rotation * 0.7, [0, 1, 0])
  // mat4.rotate(modelView, modelView, rotation * 0.3, [0, 0, 1])

  // const normal = mat4.create()
  // mat4.invert(normal, modelView)
  // mat4.transpose(normal, modelView)

  gl.uniformMatrix4fv(
    uLocations.projection,
    false,
    new Float32Array(projection),
  )

  // gl.uniformMatrix4fv(uLocations.modelView, false, new Float32Array(modelView))
  // gl.uniformMatrix4fv(uLocations.normal, false, new Float32Array(normal))

  // gl.uniform4fv(uLocations.color, [0.6, 0, 0.7, 1])

  // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
  for (const cube of cubes) {
    const modelView = mat4.create()

    mat4.translate(modelView, modelView, cube.position)
    mat4.scale(modelView, modelView, [cube.scale, cube.scale, cube.scale])
    mat4.rotate(
      modelView,
      modelView,
      rotation * cube.rotationSpeed[0]!,
      [1, 0, 0],
    )
    mat4.rotate(
      modelView,
      modelView,
      rotation * cube.rotationSpeed[1]!,
      [0, 1, 0],
    )
    mat4.rotate(
      modelView,
      modelView,
      rotation * cube.rotationSpeed[2]!,
      [0, 0, 1],
    )

    const normal = mat4.create()
    mat4.invert(normal, modelView)
    mat4.transpose(normal, modelView) // note: transpose of the inverse, not modelView
    gl.uniformMatrix4fv(uLocations.normal, false, new Float32Array(normal))
    gl.uniformMatrix4fv(
      uLocations.modelView,
      false,
      new Float32Array(modelView),
    )

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
  }
}

// const colorLocation = gl.getUniformLocation(program, 'u_color')
let then: number
let rotation = 0
const render = (now: number) => {
  const time = now * 0.001
  const delta = time - (then ?? 0)
  rotation += delta
  then = time
  drawScene(rotation)
  requestAnimationFrame(render)
}
render(0)
