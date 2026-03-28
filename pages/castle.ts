import { getCanvas } from '../src/utils'
import { Basin } from '../src/iso-engine/models/Basin'
import { vec2, vec3 } from '../src/matrix-utils'
import Stats from 'stats.js'
import { IsoScene } from '../src/iso-engine/IsoScene'
import { Fire } from '../src/iso-engine/models/Fire'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const width = 1000
const height = 1000
const canvasSize = vec2(width, height)
const [_, ctx] = getCanvas('canvas', width, height)

let t = 0

const gridSize = 50

const scene = new IsoScene(gridSize, false)

const fire1 = new Fire(vec3(1, 10, 2), 2)
const fire2 = new Fire(vec3(1, 1, 7), 3)
const fire3 = new Fire(vec3(10,1, 2), 2)
const fire4 = new Fire(vec3(1, 10, 2), 2)
const basin = new Basin(vec3(0), vec3(25, 25, 10))
const basin2 = new Basin(vec3(1, 1, 0), vec3(5, 5, 4))
const basin3 = new Basin(vec3(6, 1, 0), vec3(5, 5, 2))
const basin4 = new Basin(vec3(1, 6, 0), vec3(5, 5, 2))
const basin5 = new Basin(vec3(6, 6, 0), vec3(4, 4, 1))
// const boxShell = new BoxShell(vec3(0), vec3(3, 3, 1))

scene.add(basin2, basin3, basin4, basin5, fire2)

function render() {
  stats.begin()
  ctx.clearRect(0, 0, width, height)
  scene.draw(ctx, canvasSize, t)
  t += 1
  stats.end()
  requestAnimationFrame(render)
}
render()
