import { getWebGLCanvas } from '../src/utils'
import { CubeGeometry } from '../src/webgl/geometry/CubeGeometry'
import { Scene } from '../src/webgl/Scene'
import { Mesh } from '../src/webgl/mesh/Mesh'
import { IsoCamera } from '../src/webgl/Camera'
import { BasicMaterial } from '../src/webgl/Material'
import { Model } from '../src/webgl/Model'

const [_, gl] = getWebGLCanvas('canvas', 1000, 1000)


const camera = new IsoCamera()
const scene = new Scene(gl, camera)
const cubeGeometry = new CubeGeometry(gl)
const cubeMaterial = new BasicMaterial(gl)

const cubes: Mesh[] = []
for (let i = 0; i < 10; i++) {
  const cubea = new Mesh(cubeGeometry, cubeMaterial)
  const cubeb = new Mesh(cubeGeometry, cubeMaterial)
  const cubec = new Mesh(cubeGeometry, cubeMaterial)

  const cubed = new Mesh(cubeGeometry, cubeMaterial)
  const cubee = new Mesh(cubeGeometry, cubeMaterial)
  const cubef = new Mesh(cubeGeometry, cubeMaterial)

  cubea.position[0] = i * 1.2
  cubeb.position[1] = i * 1.2
  cubec.position[2] = i * 1.2

  cubed.position[0] = i * -1.2
  cubee.position[1] = i * -1.2
  cubef.position[2] = i * -1.2
  cubes.push(cubea, cubeb, cubec, cubed, cubee, cubef)
}
const cubesModel = new Model(cubes)
scene.addModel(cubesModel)

let t = 0
scene.render(t)
const render = () => {
  scene.render(t)
  t += 1
  requestAnimationFrame(render)
}
render()
