import { getCanvas, Grid } from '../src/utils'
import { getColorSet, IsoWire } from '../src/isowire'
import { vec2, vec3 } from '../src/matrix-utils'
import { noise3D } from '../src/simplex'
import GUI from 'lil-gui'
const gui = new GUI()

const config = {
  size: 20,
  intensity: 100,
  scale: 0.05,
  gap: 5,

  showFill: false,
  showStroke: true,
  strokeWidth: 1,
  strokeStyle: 'white',
}

const width = 1000
const height = 1000
const [canvas, ctx] = getCanvas('canvas', width, height)
const noise = noise3D()

let t = 0

const noiseAt = (x: number, y: number, z: number, scale: number) =>
  (noise(x * scale, y * scale, z) + 1) / 2

const getXY = (x: number) => x * config.size + x * config.gap

function buildGrid() {
  return new Grid<IsoWire>(20, 20, (x, y) => {
    const offset = noiseAt(x, y, t, config.scale) * config.intensity
    return new IsoWire(
      vec2(getXY(x), getXY(y)),
      vec3(config.size, 5, config.size),
      getColorSet(10 * x, 0)
    )
  })
}

let grid: Grid<IsoWire> = buildGrid()

function rebuildGrid() {
  grid = buildGrid()
}
const layout = gui.addFolder('Layout')
layout.add(config, 'size', 1, 200, 1).onChange(rebuildGrid)
layout.add(config, 'gap', 0, 50, 1)
layout.add(config, 'scale', 0.001, 1, 0.001)
layout.add(config, 'intensity', 0, 500, 1)

const style = gui.addFolder('Style')
style.add(config, 'showFill')
style.add(config, 'showStroke')
style.add(config, 'strokeWidth', 0, 20, 0.5)
style.addColor(config, 'strokeStyle')

layout.open()
style.open()

function render() {
  ctx.clearRect(0, 0, width, height)
  grid.forEach((x, y, box) => {
    const offset = noiseAt(x, y, t, config.scale) * config.intensity
    box.position = vec2(getXY(x) + offset, getXY(y) + offset)
    box.draw(ctx, vec2(width, height), {
      showFill: config.showFill,
      showStroke: config.showStroke,
      strokeWidth: config.strokeWidth,
      strokeStyle: config.strokeStyle,
    })
  })
  console.log(config.strokeStyle)
  t += 0.005
  requestAnimationFrame(render)
}
render()
