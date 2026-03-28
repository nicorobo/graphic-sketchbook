import { getWebGLCanvas } from '../src/utils'
import { CubeGeometry } from '../src/webgl/geometry/CubeGeometry'
import { Scene } from '../src/webgl/Scene'
import { Mesh } from '../src/webgl/mesh/Mesh'

const [canvas, gl] = getWebGLCanvas('canvas', 1000, 1000)

const scene = new Scene(gl)
const cubeGeometry = new CubeGeometry(gl, scene.program)

const cubes: Mesh[] = []
for (let i = 0; i < 200; i++) {
  const cube = new Mesh(cubeGeometry)
  cube.position = [0, 1 * i - 30, -30]
  cube.scale = [1, 0.1, 1]
  cubes.push(cube)
}
scene.addMesh(...cubes)
scene.render(0)
let t = 0
const render = () => {
  for (let i = 0; i < cubes.length; i++) {
    // cubes[i]!.rotation[1] = t * 0.1 + Math.sin(i * 0.1)
    // cubes[i]!.position[0] = Math.sin(t * 0.01 + i * 0.3) * 5
    cubes[i]!.position[0] = Math.sin(t * 0.02 + i * 0.3) * 10
    cubes[i]!.position[1] = Math.sin(t * 0.033 + i * 0.4) * 10
  }
  scene.render(0)
  t += 1
  requestAnimationFrame(render)
}
render()
