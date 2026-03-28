import { mat3, mat4 } from 'gl-matrix'
import type { Geometry } from '../geometry/Geometry'
import { Transformable } from '../Transformable'
import type { Material } from '../Material'

type Vec3 = [number, number, number]
type Vec4 = [number, number, number, number]
type Transform = { position?: Vec3, rotation?: Vec3, scale?: Vec3 }
export class Mesh extends Transformable {
  color: Vec4 = [1, 1, 1, 1]

  constructor(private geometry: Geometry, private material: Material, transform?: Transform) {
    super(transform)
  }

  draw(
    gl: WebGL2RenderingContext,
    mvp: mat4
  ) {
    this.material.bind(gl)
    const { uniforms } = this.material
    const meshView = this.getTransformMatrix()
    const final = mat4.create()
    mat4.multiply(final, mvp, meshView)
    if (uniforms['u_mvp']) {
      gl.uniformMatrix4fv(
        uniforms['u_mvp'],
        false,
        new Float32Array(final),
      )
    }

    if (uniforms['u_normal']) {
      const normal = mat3.create()
      mat3.normalFromMat4(final, normal)
      gl.uniformMatrix3fv(uniforms['u_normal'], false, new Float32Array(normal))
    }

    if (uniforms['u_color']) {
      gl.uniform4fv(uniforms['u_color'], this.color)
    }

    gl.drawElements(
      gl.TRIANGLES,
      this.geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0,
    )
  }
}
