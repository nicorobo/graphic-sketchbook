import { simple_vert, simple_frag, iso_vert, iso_frag } from '../shaders/'
export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Shader not created...')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader

  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  throw new Error('Error occured while creating shader')
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSrc: string,
  fragmentShaderSrc: string,
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) return program

  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
  throw new Error('Error occured while creating program')
}

export const createBasicProgram = (gl: WebGL2RenderingContext) => {
  return createProgram(gl, simple_vert, simple_frag)
}

export interface IsoProgramULocations {
  projection: WebGLUniformLocation
  modelView: WebGLUniformLocation
  normal: WebGLUniformLocation
  color: WebGLUniformLocation
}
export const createIsoProgram = (gl: WebGL2RenderingContext) => {
  const program = createProgram(gl, iso_vert, iso_frag)
  return {
    program,
    uLocations: {
      projection: gl.getUniformLocation(program, 'u_projection'),
      modelView: gl.getUniformLocation(program, 'u_modelView'),
      normal: gl.getUniformLocation(program, 'u_normal'),
      color: gl.getUniformLocation(program, 'u_color'),
    } as IsoProgramULocations,
  }
}

export const setAttr = (
  gl: WebGL2RenderingContext,
  attrLocation: number,
  arr: number[],
  size: number,
) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(attrLocation)
  gl.vertexAttribPointer(attrLocation, size, gl.FLOAT, false, 0, 0)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
}

export const setIndexBuffer = (
  gl: WebGL2RenderingContext,
  indices: number[],
) => {
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  )
  return indexBuffer
}
