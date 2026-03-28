import { setIndexBuffer, setAttr } from '../webgl-utils'

export class Geometry {
  vao: WebGLVertexArrayObject
  triangleBuffer: WebGLBuffer
  edgeBuffer: WebGLBuffer

  constructor(
    gl: WebGL2RenderingContext,
    positions: number[],
    normals: number[],
    public indices: number[],
    public edgeIndes: number[],
  ) {
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    setAttr(gl, 0, positions, 3)
    setAttr(gl, 1, normals, 3)

    this.triangleBuffer = setIndexBuffer(gl, indices)
    this.edgeBuffer = setIndexBuffer(gl, edgeIndes)
  }

  bindTriangles(gl: WebGL2RenderingContext) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer)
  }

  bindEdges(gl: WebGL2RenderingContext) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer)
  }
}
