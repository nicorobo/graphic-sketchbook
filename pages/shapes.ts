import { IsoScene } from '../src/iso-engine/IsoScene'
import { IsoVoxel } from '../src/iso-engine/IsoVoxel'
import { Fire } from '../src/iso-engine/models/Fire'
import { Vase } from '../src/iso-engine/models/Vase'
import { vec2, vec3 } from '../src/matrix-utils'
import { getCanvas } from '../src/utils'
import Stats from 'stats.js'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

const width = 1000
const height = 1000
const [canvas, ctx] = getCanvas('canvas', width, height)

let t = 1

const shape1 = new Vase(vec3(0))
const fire = new Fire(vec3(0), 4)
const scene = new IsoScene(50, false, 0.1)
scene.add(fire)

scene.draw(ctx, vec2(width, height), t)
function render() {
  stats.begin()
  ctx.clearRect(0, 0, width, height)
  scene.draw(ctx, vec2(width, height), t)
  t += 1
  stats.end()
  requestAnimationFrame(render)
}
render()
