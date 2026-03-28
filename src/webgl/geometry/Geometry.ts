import { setIndexBuffer, setAttr } from '../webgl-utils'

export class Geometry {
  vao: WebGLVertexArrayObject

  constructor(
    gl: WebGL2RenderingContext,
    positions: number[],
    normals: number[],
    public indices: number[],
  ) {
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    setAttr(gl, 0, positions, 3)
    setAttr(gl, 1, normals, 3)
    setIndexBuffer(gl, indices)
  }
}
