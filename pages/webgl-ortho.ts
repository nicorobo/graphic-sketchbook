import { m4 } from '../src/webgl/m4'
import { getWebGLCanvas } from '../src/utils'
import { createBasicProgram } from '../src/webgl/webgl-utils'
import GUI from 'lil-gui'
const gui = new GUI()

const [canvas, gl] = getWebGLCanvas('canvas', 1000, 1000)

const params = {
  width: 175,
  height: 300,

  translation: {
    x: 100,
    y: 100,
    z: 0,
  },

  rotation: {
    x: 0,
    y: 0,
    z: -10, // degrees (much nicer for a GUI)
  },

  scale: {
    x: 1,
    y: 1,
    z: 1,
  },
}
const degToRad = (d: number) => (d * Math.PI) / 180
// Size
gui.add(params, 'width', 0, 1000, 1)
gui.add(params, 'height', 0, 1000, 1)

// Translation
const translationFolder = gui.addFolder('Translation')
translationFolder.add(params.translation, 'x', -500, 500, 1)
translationFolder.add(params.translation, 'y', -500, 500, 1)
translationFolder.add(params.translation, 'z', -500, 500, 1)

// Rotation
const rotationFolder = gui.addFolder('Rotation')
rotationFolder.add(params.rotation, 'x', -180, 180, 1)
rotationFolder.add(params.rotation, 'y', -180, 180, 1)
rotationFolder.add(params.rotation, 'z', -180, 180, 1)

// Scale
const scaleFolder = gui.addFolder('Scale')
scaleFolder.add(params.scale, 'x', 0.01, 5, 0.01)
scaleFolder.add(params.scale, 'y', 0.01, 5, 0.01)
scaleFolder.add(params.scale, 'z', 0.01, 5, 0.01)

const color = [Math.random(), Math.random(), Math.random(), 1]

const program = createBasicProgram(gl)

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

const setPositionAttr = (gl: WebGL2RenderingContext, arr: number[]) => {
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
}

const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
const colorLocation = gl.getUniformLocation(program, 'u_color')

class Cube {
  static vertices = [
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
  ].flat()
  static indices = [
    [0, 1, 2],
    [0, 2, 3],
    [1, 5, 6],
    []
  ]
}
3.      2  
  7    6
  4.  5
0.      1

function drawScene() {
  const translation = [
    params.translation.x,
    params.translation.y,
    params.translation.z,
  ] as const

  const rotation = [
    degToRad(params.rotation.x),
    degToRad(params.rotation.y),
    degToRad(params.rotation.z),
  ] as const

  const scale = [params.scale.x, params.scale.y, params.scale.z] as const
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  // gl.bindVertexArray(vao)

  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.uniform4fv(colorLocation, color)

  let matrix = m4.projection(500, 500, 500)
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
  matrix = m4.xRotate(matrix, rotation[0])
  matrix = m4.yRotate(matrix, rotation[1])
  matrix = m4.zRotate(matrix, rotation[2])
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

  const primitiveType = gl.TRIANGLES
  const count = 16 * 6

  gl.uniformMatrix4fv(matrixLocation, false, matrix)

  gl.drawArrays(primitiveType, 0, count)
  // requestAnimationFrame(drawScene)
}

drawScene()
