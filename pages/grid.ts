import { getCanvas, Grid } from '../src/utils'
import { noise3D } from '../src/simplex'

const width = 1000
const height = 1000
const [canvas, ctx] = getCanvas('canvas', width, height)

const noise = noise3D()

const intensity = 100
const scale = 0.01
const g = new Grid<number>(
  100,
  100,
  (x, y) => (noise(x * scale, y * scale) + 1) * Math.PI
)
// g.forEach((gx, gy, value = 3) => {
//   const x = g.fromGridXCoord(gx, width)
//   const y = g.fromGridYCoord(gy, height)
//   ctx.fillStyle = `rgb(200, ${gx * 5},${gy * 5})`
//   ctx.fillRect(x, y, value, value)
// })
let t = 0
function render() {
  ctx.clearRect(0, 0, width, height)
  g.setValues((x, y) => (noise(x * scale, y * scale, t) + 1) * Math.PI)
  g.forEachRow((gy, row) => {
    const y = g.fromGridYCoord(gy, height)
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let gx = 0; gx < row.length; gx++) {
      const x = g.fromGridXCoord(gx, width)
      const dy = Math.sin(row[gx]!) * gy 
      ctx.lineTo(x, y + dy)
    }
    ctx.lineWidth = 1
    ctx.strokeStyle = 'pink'
    ctx.stroke()
  })

//   g.forEachCol((gy, row) => {
//     const y = g.fromGridXCoord(gy, height)
//     ctx.beginPath()
//     ctx.moveTo(y, 0)
//     for (let gx = 0; gx < row.length; gx++) {
//       const x = g.fromGridYCoord(gx, width)
//       const dy = Math.sin(row[gx]!) * intensity
//       ctx.lineTo(y + dy, x)
//     }
//     ctx.lineWidth = 2
//     ctx.strokeStyle = 'green'
//     ctx.stroke()
//   })
  t += 0.005
  requestAnimationFrame(render)
}
render()
