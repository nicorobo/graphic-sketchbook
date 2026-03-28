import { getCanvas, Grid } from '../src/utils'
import { IsoBox } from '../src/isobox'
import { vec3 } from '../src/matrix-utils'
import { noise3D } from '../src/simplex'

const width = 1500
const height = 1500
const [canvas, ctx] = getCanvas('canvas', width, height)

const noise = noise3D()

const size = 40
const intensity = 70
const scale = 0.08
const gap = 10

let t = 0

const noiseAt = (x: number, y: number, z: number, scale: number) =>
  (noise(x * scale, y * scale, z) + 1) / 2

const getXY = (x: number) => x * size + x * gap - 0
const grid = new Grid<IsoBox>(40, 30, (x, y) => {
  const offset = noiseAt(x, y, t, scale) * intensity
  return new IsoBox(
    vec3(getXY(x), getXY(y), 0 - offset),
    vec3(size, size, 5),
    vec3(0, 0, 0),
    `rgba(${x * 15}, ${y * 15}, 150, 0.5)`
  )
})

function render() {
  ctx.clearRect(0, 0, width, height)
  grid.forEach((x, y, box) => {
    const offset = noiseAt(x, y, t, scale) * intensity
    box.position.z = -offset
    // box.rotation.y += 0.01
    // box.rotation.z += 0.02
    // box.size.z = -offset
    box.draw(ctx)
  })
  t += 0.005
  requestAnimationFrame(render)
}
render()
