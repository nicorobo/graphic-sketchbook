import { mat3, mat4 } from 'gl-matrix'
import type { Geometry } from '../geometry/Geometry'
import { Transformable } from '../Transformable'
import type { Material } from '../Material'

type Vec3 = [number, number, number]
type Vec4 = [number, number, number, number]
type Transform = { position?: Vec3; rotation?: Vec3; scale?: Vec3 }
export class Mesh extends Transformable {
  color: Vec4 = [1, 0, 1, 1]
  edgeColor: Vec4 = [0, 0, 0, 1]

  constructor(
    private geometry: Geometry,
    private material: Material,
    private edgeMaterial: Material,
    transform?: Transform,
  ) {
    super(transform)
  }

  draw(gl: WebGL2RenderingContext, mvp: mat4, modelMatrix: mat4) {
    const meshMatrix = this.getTransformMatrix()

    const final = mat4.create()
    mat4.multiply(final, mvp, meshMatrix)

    const fullModel = mat4.create()
    mat4.multiply(fullModel, modelMatrix, meshMatrix)

    this.material.bind(gl)
    const { uniforms } = this.material
    if (uniforms['u_mvp']) {
      gl.uniformMatrix4fv(uniforms['u_mvp'], false, new Float32Array(final))
    }

    if (uniforms['u_model'])
      gl.uniformMatrix4fv(
        uniforms['u_model'],
        false,
        new Float32Array(fullModel),
      )

    if (uniforms['u_color']) {
      gl.uniform4fv(uniforms['u_color'], this.color)
    }
    this.geometry.bindTriangles(gl)
    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1, 1)
    gl.drawElements(
      gl.TRIANGLES,
      this.geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0,
    )
    gl.disable(gl.POLYGON_OFFSET_FILL)
    this.edgeMaterial.bind(gl)
    this.geometry.bindEdges(gl)
    const { uniforms: eu } = this.edgeMaterial
    if (eu['u_mvp'])
      gl.uniformMatrix4fv(eu['u_mvp'], false, new Float32Array(final))
    if (eu['u_color']) gl.uniform4fv(eu['u_color'], this.edgeColor)
    gl.drawElements(
      gl.LINES,
      this.geometry.edgeIndes.length,
      gl.UNSIGNED_SHORT,
      0,
    )
  }
}
