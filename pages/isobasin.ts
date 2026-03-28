import { getWebGLCanvas } from '../src/utils'
import { Scene } from '../src/webgl/Scene'
import { IsoCamera } from '../src/webgl/Camera'
import { Basin } from '../src/webgl/mesh/Basin'

const [_, gl] = getWebGLCanvas('canvas', 1000, 1000)

const camera = new IsoCamera()
const scene = new Scene(gl, camera)
const basin = new Basin(gl, [8, 3, 9])
basin.position = [-5, 0, -5]
scene.addModel(basin)

let t = 0
scene.render(t)
const render = () => {
  scene.render(t)
  basin.rotation[0] = t * 0.004
  t += 1
  requestAnimationFrame(render)
}
render()
