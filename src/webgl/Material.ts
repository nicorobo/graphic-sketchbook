import { iso_frag, iso_vert, edge_vert, edge_frag } from '../shaders'
import { createProgram } from './webgl-utils'

export class Material {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation>

  constructor(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
    this.program = createProgram(gl, vertSrc, fragSrc) // your compile/link helper
    this.uniforms = {}
  }

  cacheUniforms(gl: WebGL2RenderingContext, names: string[]) {
    for (const name of names) {
      const loc = gl.getUniformLocation(this.program, name)
      if (loc) this.uniforms[name] = loc
    }
  }

  bind(gl: WebGL2RenderingContext) {
    gl.useProgram(this.program)
  }
}

export class BasicMaterial extends Material {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, iso_vert, iso_frag)
    this.cacheUniforms(gl, ['u_mvp', 'u_color', 'u_model'])
  }
}

export class EdgeMaterial extends Material {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, edge_vert, edge_frag)
    this.cacheUniforms(gl, ['u_mvp', 'u_color'])
  }
}
