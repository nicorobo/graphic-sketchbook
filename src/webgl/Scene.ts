import type { Model } from './Model'
import type { Camera } from './Camera'

export class Scene {
  models: Model[] = []
  constructor(
    private gl: WebGL2RenderingContext,
    private camera: Camera,
  ) {}

  addModel(...models: Model[]) {
    this.models.push(...models)
  }

  render(time: number) {
    const { gl, models } = this
    gl.clearDepth(1.0) // Clear everything
    gl.enable(gl.DEPTH_TEST) // Enable depth testing
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    for (const model of models) {
      model.draw(gl, this.camera.getProjectionMatrix())
    }
  }
}
